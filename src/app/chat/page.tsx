
"use client";

import { useState, useEffect, useRef } from "react";
import { dynamicDialogue, type DynamicDialogueInput } from "@/ai/flows/dynamic-dialogue";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Loader2, Mic, Volume2, Phone, Video } from "lucide-react";
import { CHAT_SETTINGS_KEY, CHAT_MESSAGES_KEY_PREFIX } from "@/lib/constants";
import { 
  initialCompanions, 
  languageOptions, 
  type Companion, 
  type LanguageOption, 
  type ChatSettings, 
  type CompanionCustomizations 
} from "@/lib/companions-data";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  companionId?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  const [userName, setUserName] = useState("User");
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>(initialCompanions[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languageOptions[0].value);
  const [companionCustomizations, setCompanionCustomizations] = useState<{ [companionId: string]: CompanionCustomizations }>({});

  const [isListening, setIsListening] = useState(false);
  const [isSpeakingMessageId, setIsSpeakingMessageId] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Attempt to load voices early, browsers might need some time.
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices(); 
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Load general chat settings
  useEffect(() => {
    if (isClient) {
      try {
        const storedSettings = localStorage.getItem(CHAT_SETTINGS_KEY);
        if (storedSettings) {
          const parsedSettings: ChatSettings = JSON.parse(storedSettings);
          setUserName(parsedSettings.userName || "User");
          setSelectedCompanionId(parsedSettings.selectedCompanionId || initialCompanions[0].id);
          setSelectedLanguage(parsedSettings.selectedLanguage || languageOptions[0].value);
          setCompanionCustomizations(parsedSettings.companionCustomizations || {});
        } else {
           toast({
            title: "Welcome!",
            description: "Chat settings use defaults. You can change them on the Companion page.",
          });
        }
      } catch (error) {
          console.error("Failed to load chat settings from localStorage for chat page:", error);
           toast({
            title: "Error loading settings",
            description: "Using default chat settings. Please check Companion page.",
            variant: "destructive",
          });
      }
    }
  }, [isClient, toast]);

  const selectedCompanion = initialCompanions.find(c => c.id === selectedCompanionId) || initialCompanions[0];
  const currentLanguageAiName = languageOptions.find(l => l.value === selectedLanguage)?.aiName || "English";
  const currentLanguageLabel = languageOptions.find(l => l.value === selectedLanguage)?.label || "English";


  const currentCompanionSpecificCustomizations = companionCustomizations[selectedCompanionId] || {};
  const currentSelectedTraits = currentCompanionSpecificCustomizations.selectedTraits || [];
  const currentCustomAvatarUrl = currentCompanionSpecificCustomizations.customAvatarUrl;

  // Load messages from localStorage when component mounts or selectedCompanionId changes
  useEffect(() => {
    if (isClient && selectedCompanion?.id) {
      const messagesKey = CHAT_MESSAGES_KEY_PREFIX + selectedCompanion.id;
      try {
        const storedMessages = localStorage.getItem(messagesKey);
        if (storedMessages) {
          const parsedMessages: Message[] = JSON.parse(storedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp), 
          }));
          setMessages(parsedMessages);
        } else {
          setMessages([]); 
        }
      } catch (error) {
        console.error("Failed to load messages from localStorage:", error);
        setMessages([]);
        toast({
          title: "Error loading messages",
          description: "Could not retrieve previous messages.",
          variant: "destructive",
        });
      }
    }
  }, [isClient, selectedCompanion?.id, toast]);

  // Save messages to localStorage whenever messages or selectedCompanionId changes
  useEffect(() => {
    if (isClient && selectedCompanion?.id) { // Save only if a companion is selected
       const messagesKey = CHAT_MESSAGES_KEY_PREFIX + selectedCompanion.id;
      try {
         if (messages.length > 0) {
            localStorage.setItem(messagesKey, JSON.stringify(messages));
         } else {
            // If messages become empty (e.g. user clears them or starts fresh), remove from storage
            localStorage.removeItem(messagesKey);
         }
      } catch (error: any) {
        console.error("Failed to save messages to localStorage:", error);
        if (error.name === 'QuotaExceededError' || (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22))) {
            toast({
                title: "Storage Full",
                description: "Cannot save new messages, browser storage is full. Older messages might not be saved.",
                variant: "destructive",
                duration: 7000,
            });
        } else {
            toast({
                title: "Error saving messages",
                description: "Could not save new messages.",
                variant: "destructive",
            });
        }
      }
    }
  }, [messages, selectedCompanion?.id, isClient, toast]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Input required",
        description: "Please type a message.",
        variant: "destructive",
      });
      return;
    }
     if (!isClient || !userName.trim() || !selectedCompanionId || !selectedLanguage || !selectedCompanion) {
      toast({
        title: "Setup Required",
        description: "Please configure your chat settings on the 'Companion' page first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userInput,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setUserInput("");

    try {
      const aiInput: DynamicDialogueInput = {
        userId: "default-user", 
        message: userMessage.text,
        userName: userName,
        companionId: selectedCompanion.id,
        companionName: selectedCompanion.name,
        companionPersona: selectedCompanion.persona,
        language: currentLanguageAiName,
        selectedTraits: currentSelectedTraits.length > 0 ? currentSelectedTraits : undefined,
      };
      const aiResponse = await dynamicDialogue(aiInput);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponse.response,
        timestamp: new Date(),
        companionId: selectedCompanion.id,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error calling AI:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from AI. Please try again.",
        variant: "destructive",
      });
       setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
       setUserInput(userMessage.text); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!isClient) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser does not support voice recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    recognition.lang = selectedLanguage;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast({ title: "Listening...", description: "Speak now.", duration: 3000});
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput((prevUserInput) => prevUserInput + transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error event:", event);
      let errorMessage = "Could not understand audio.";
      if (event.error) {
        switch (event.error) {
          case 'no-speech':
            errorMessage = "No speech was detected. Please try again.";
            break;
          case 'audio-capture':
            errorMessage = "No microphone was found. Ensure that a microphone is installed and that microphone access is allowed in your operating system and browser settings.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone access was denied. Please allow access in your browser's site settings and ensure your operating system permits microphone access for this browser.";
            break;
          case 'network':
            errorMessage = "A network error occurred during speech recognition. Please check your internet connection.";
            break;
          case 'aborted':
            if (isListening) {
                 errorMessage = "Voice input was interrupted. Please try again.";
            } else {
                setIsListening(false);
                recognitionRef.current = null;
                return;
            }
            break;
          case 'service-not-allowed':
             errorMessage = "Speech recognition service is not allowed. This might be due to browser policy or an extension. Please check your browser settings."
             break;
          case 'language-not-supported':
            errorMessage = `The selected language (${currentLanguageLabel}) is not supported for voice input by your browser.`;
            break;
          default:
            errorMessage = `An unexpected voice error occurred: ${event.error}.`;
        }
      }
      if (errorMessage) {
        toast({ title: "Voice Error", description: errorMessage, variant: "destructive" });
      }
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast({ title: "Voice Error", description: "Failed to start voice recognition.", variant: "destructive" });
        setIsListening(false);
        if (recognitionRef.current) {
           recognitionRef.current = null;
        }
    }
  };

  const handleReadAloud = (text: string, messageId: string) => {
    if (!isClient || typeof window === 'undefined' || !window.speechSynthesis) {
        toast({ title: "Speech Error", description: "Text-to-speech not supported or available.", variant: "destructive" });
        return;
    }

    if (isSpeakingMessageId === messageId && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeakingMessageId(null);
        return;
    }

    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel(); 
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    let targetLang = languageOptions.find(l => l.value === selectedLanguage)?.value || 'en';
    if (targetLang.includes('-')) targetLang = targetLang.split('-')[0];

    let selectedVoice = voices.find(voice => voice.lang === selectedLanguage);
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith(targetLang));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
       utterance.lang = targetLang; 
       console.warn(`No specific voice found for lang ${selectedLanguage} (target: ${targetLang}). Using browser default for this language.`);
       if (targetLang !== 'en') {
         toast({ title: "Voice Note", description: `No specific voice found for ${currentLanguageLabel}. Using a default voice. Quality may vary.`, duration: 5000 });
       }
    }

    utterance.onstart = () => setIsSpeakingMessageId(messageId);
    utterance.onend = () => setIsSpeakingMessageId(null);
    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
     console.error("Speech synthesis error", event.error, event);
     toast({ title: "Speech Error", description: `Could not read aloud. ${event.error || 'Unknown error.'}`, variant: "destructive" });
     setIsSpeakingMessageId(null);
    };
    window.speechSynthesis.speak(utterance);
  };


  if (!isClient || !selectedCompanion) {
     return (
      <div className="flex flex-col h-[calc(100vh-var(--header-height,0px)-4rem)] md:h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading chat with {selectedCompanion?.name || 'your companion'}...</p>
      </div>
    );
  }

  const handleVoiceCall = () => {
    toast({ title: "Voice Call (Coming Soon)", description: `Voice calling ${selectedCompanion.name} is a future feature!`});
  };

  const handleVideoCall = () => {
    toast({ title: "Video Call (Coming Soon)", description: `Video calling ${selectedCompanion.name} is a future feature!`});
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,0px)-4rem)] md:h-[calc(100vh-4rem)]">
      <Card className="flex flex-col flex-grow overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentCustomAvatarUrl || selectedCompanion.avatarImage} alt={selectedCompanion.name} data-ai-hint={selectedCompanion.dataAiHint}/>
                <AvatarFallback>{selectedCompanion.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">
                Chat with {selectedCompanion.name}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleVoiceCall} aria-label="Voice Call">
                <Phone className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleVideoCall} aria-label="Video Call">
                <Video className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-4 pr-6">
            <div className="space-y-4">
              {messages.map((msg) => {
                const companionForMessage = msg.sender === "ai"
                  ? initialCompanions.find(c => c.id === msg.companionId) || selectedCompanion
                  : selectedCompanion;

                const avatarForMessage = msg.sender === "ai"
                  ? (companionCustomizations[msg.companionId || selectedCompanionId]?.customAvatarUrl || companionForMessage.avatarImage)
                  : "";

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarForMessage} alt={companionForMessage.name} data-ai-hint={companionForMessage.dataAiHint}/>
                        <AvatarFallback>{companionForMessage.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] rounded-xl px-4 py-3 ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-card-foreground border"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {msg.sender === "ai" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 ${isSpeakingMessageId === msg.id ? 'text-primary animate-pulse' : 'text-muted-foreground hover:text-primary'}`}
                            onClick={() => handleReadAloud(msg.text, msg.id)}
                            disabled={isSpeakingMessageId === msg.id && typeof window !== 'undefined' && window.speechSynthesis?.pending}
                            aria-label={isSpeakingMessageId === msg.id ? "Stop reading" : "Read message aloud"}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {msg.sender === "user" && (
                      <Avatar className="h-8 w-8">
                         <AvatarFallback>
                           <User />
                         </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardContent className="pt-4 border-t">
            <form
                onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
                }}
                className="flex gap-2 items-start"
            >
                <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`Type or say your message to ${selectedCompanion.name}...`}
                className="flex-grow resize-none"
                rows={2}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                    }
                }}
                aria-label={`Your message to ${selectedCompanion.name}`}
                />
                <Button
                  type="button"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={handleVoiceInput}
                  disabled={isLoading}
                  className="h-full px-4 py-2 aspect-square"
                  aria-label={isListening ? "Stop voice input" : "Start voice input"}
                >
                    {isListening ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
                    <span className="sr-only">{isListening ? "Stop Voice Input" : "Use Voice Input"}</span>
                </Button>
                <Button type="submit" disabled={isLoading || !userInput.trim()} className="h-full px-4 py-2 aspect-square">
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Send className="h-5 w-5" />
                )}
                <span className="sr-only">Send message</span>
                </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
