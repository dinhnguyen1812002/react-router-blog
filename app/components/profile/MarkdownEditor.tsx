import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/Card";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  // Simple markdown preview (in production, use a proper markdown parser)
  const renderMarkdown = (text: string) => {
    let html = text;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');
    
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener">$1</a>');
    
    // Line breaks
    html = html.replace(/\n/gim, '<br />');
    
    return html;
  };

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "write" | "preview")} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="write" className="mt-4">
        <Textarea
          placeholder="Write your extended bio here... You can use Markdown formatting!"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
          className="font-mono text-sm"
        />
        <div className="mt-2 text-xs text-muted-foreground space-y-1">
          <p>Markdown shortcuts:</p>
          <ul className="list-disc list-inside space-y-1">
            <li># Heading 1, ## Heading 2, ### Heading 3</li>
            <li>**bold text**, *italic text*</li>
            <li>[link text](url)</li>
          </ul>
        </div>
      </TabsContent>
      
      <TabsContent value="preview" className="mt-4">
        <Card className="p-4 min-h-[200px] bg-muted/30">
          {value ? (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
            />
          ) : (
            <p className="text-muted-foreground italic">Nothing to preview yet...</p>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
};
