// import { ArticleEditor } from "~/components/article/ArticleEditor";

import { FileText,Save } from "lucide-react";
import { useState } from "react";
// import { DocumentMetadata } from "~/components/article/document-metadata";
// import { SavePostDialog } from "~/components/article/save-post-dialog";
// import { TiptapEditor } from "~/components/article/tiptap-editor";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import { Button, Input } from "~/components/ui";


// const Index = () => {
//   return <ArticleEditor />;
// };

// export default Index;
export default function article() {
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)


    return (

      <div className="flex flex-col h-screen">
      {/* <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card rounded-lg">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-foreground" />
          <h1 className="text-lg font-semibold text-foreground">Tiptap Editor</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsSaveDialogOpen(true)} className="gap-2">
            <Save className="h-4 w-4" />
            Save Post
          </Button>
         
        </div>
      </header> */}

      <main className="flex-1 overflow-y-auto dark:text-white bg-muted">
         <SimpleEditor />
      </main>

      {/* <SavePostDialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen} /> */}
    </div>
    );
}