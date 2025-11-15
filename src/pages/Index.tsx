import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Clock, Lock, Unlock, Copy, Check, ExternalLink, Calendar } from "lucide-react";
import { toast } from "sonner";

interface MessageData {
  sender: string;
  message: string;
  externalLink?: string;
  unsealDate: string;
}

const Index = () => {
  const [view, setView] = useState<"sender" | "receiver">("sender");
  const [messageData, setMessageData] = useState<MessageData | null>(null);
  const [isUnsealed, setIsUnsealed] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  // Sender form state
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [unsealDate, setUnsealDate] = useState("");

  useEffect(() => {
    // Check if URL contains encoded data
    const hash = window.location.hash;
    if (hash.startsWith("#data=")) {
      try {
        const encoded = hash.substring(6);
        const decoded = JSON.parse(atob(decodeURIComponent(encoded)));
        setMessageData(decoded);
        setView("receiver");
      } catch (error) {
        console.error("Failed to decode message:", error);
        toast.error("Invalid message link");
      }
    }
  }, []);

  useEffect(() => {
    if (messageData && view === "receiver") {
      const updateCountdown = () => {
        const now = new Date().getTime();
        const unsealTime = new Date(messageData.unsealDate).getTime();
        const difference = unsealTime - now;

        if (difference <= 0) {
          setIsUnsealed(true);
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          setCountdown({ days, hours, minutes, seconds });
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [messageData, view]);

  const generateLink = () => {
    if (!senderName || !message || !unsealDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const data: MessageData = {
      sender: senderName,
      message: message,
      externalLink: externalLink || undefined,
      unsealDate: unsealDate,
    };

    const encoded = encodeURIComponent(btoa(JSON.stringify(data)));
    const link = `${window.location.origin}${window.location.pathname}#data=${encoded}`;
    setGeneratedLink(link);
    toast.success("Link generated successfully!");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const resetToSender = () => {
    window.location.hash = "";
    setView("sender");
    setMessageData(null);
    setIsUnsealed(false);
    setGeneratedLink("");
  };

  const isYouTubeLink = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.includes("youtu.be")
      ? url.split("youtu.be/")[1]?.split("?")[0]
      : url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const isImageLink = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  if (view === "receiver" && messageData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-mystical animate-fade-in">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        
        <Card className="relative max-w-2xl w-full p-8 md:p-12 backdrop-blur-xl bg-card/80 border-white/20 shadow-glow">
          {!isUnsealed ? (
            <div className="text-center space-y-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-mystical animate-pulse-glow">
                <Lock className="w-10 h-10 text-white" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  A message from {messageData.sender}
                </h1>
                <p className="text-muted-foreground text-lg">will unseal in...</p>
              </div>

              <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
                {[
                  { label: "Days", value: countdown.days },
                  { label: "Hours", value: countdown.hours },
                  { label: "Minutes", value: countdown.minutes },
                  { label: "Seconds", value: countdown.seconds },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="bg-gradient-mystical p-4 rounded-2xl shadow-glow">
                      <div className="text-3xl md:text-4xl font-bold text-white">
                        {String(item.value).padStart(2, "0")}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(messageData.unsealDate).toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-mystical animate-float">
                  <Unlock className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Your Message from {messageData.sender}
                </h1>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="bg-gradient-glass p-6 rounded-2xl border border-white/20 backdrop-blur-sm">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {messageData.message}
                  </p>
                </div>
              </div>

              {messageData.externalLink && (
                <div className="space-y-4">
                  {isYouTubeLink(messageData.externalLink) ? (
                    <div className="aspect-video rounded-2xl overflow-hidden shadow-card">
                      <iframe
                        src={getYouTubeEmbedUrl(messageData.externalLink)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : isImageLink(messageData.externalLink) ? (
                    <img
                      src={messageData.externalLink}
                      alt="Attached media"
                      className="w-full rounded-2xl shadow-card"
                    />
                  ) : (
                    <a
                      href={messageData.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-mystical text-white rounded-full hover:opacity-90 transition-opacity"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Attached Link
                    </a>
                  )}
                </div>
              )}

              <div className="pt-8 border-t border-border">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">That was fun, right?</p>
                  <p className="text-foreground font-medium">
                    Send your own time-locked message to a friend →
                  </p>
                  <Button
                    onClick={resetToSender}
                    size="lg"
                    className="bg-gradient-mystical hover:opacity-90 transition-opacity text-white px-8"
                  >
                    Create Your Time Capsule
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-mystical">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      
      <Card className="relative max-w-2xl w-full p-8 md:p-12 backdrop-blur-xl bg-card/80 border-white/20 shadow-glow animate-fade-in">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-mystical mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            The Unsealable Message
          </h1>
          <p className="text-muted-foreground text-lg">
            Create a time-locked message for someone special
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sender" className="text-foreground font-medium">
              Your Name *
            </Label>
            <Input
              id="sender"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Enter your name"
              className="bg-background/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground font-medium">
              Secret Message *
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your time-locked message..."
              rows={6}
              className="bg-background/50 border-border resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link" className="text-foreground font-medium">
              External Link (Optional)
            </Label>
            <Input
              id="link"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="YouTube, Spotify, image URL, etc."
              className="bg-background/50 border-border"
            />
            <p className="text-xs text-muted-foreground">
              YouTube videos will auto-embed, images will display inline
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground font-medium">
              Unseal Date & Time *
            </Label>
            <Input
              id="date"
              type="datetime-local"
              value={unsealDate}
              onChange={(e) => setUnsealDate(e.target.value)}
              className="bg-background/50 border-border"
            />
          </div>

          <Button
            onClick={generateLink}
            className="w-full bg-gradient-mystical hover:opacity-90 transition-opacity text-white py-6 text-lg"
            size="lg"
          >
            Generate Link
          </Button>

          {generatedLink && (
            <div className="space-y-4 p-6 bg-gradient-glass rounded-2xl border border-white/20 backdrop-blur-sm animate-fade-in">
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Your Generated Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="bg-background/50 border-border font-mono text-sm"
                  />
                  <Button
                    onClick={copyLink}
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this link with your recipient. The message will only be visible after the unseal date.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Index;
