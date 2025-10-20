// import { ArticleEditor } from "~/components/article/ArticleEditor";

import { FileText, Save } from "lucide-react";
import { useState } from "react";

// import { SavePostDialog } from "~/components/article/save-post-dialog";
// import { DocumentMetadata } from "~/components/article/document-metadata";

// import { TiptapEditor } from "~/components/article/tiptap-editor";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import { Button, Input } from "~/components/ui";
import type { Route } from "../+types";

// const Index = () => {
//   const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)

//   return  (
//     <div>

//     <div className="dark:text-white dark:bg-black/40">
//       <SimpleEditor />
//     </div>
//     </div>

//   );

// };

// export default Index;

export function meta({}: Route.MetaArgs) {
  return [{ title: "Writing your article" }];
}

export default function article() {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <main className="dark:text-white dark:bg-black/40">
        <SimpleEditor />
      </main>
    </div>
  );
}
