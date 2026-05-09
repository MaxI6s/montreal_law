import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { useStore } from "@/store/useStore";
import { useEffect, useRef } from "react";

export default function OnlyOfficeViewer() {
  const { activeDocumentId, activeRole, selectedClauseId } = useStore();
  const connectorRef = useRef<any>(null);

  // Example of using the Connector API to synchronize
  useEffect(() => {
    if (selectedClauseId && connectorRef.current) {
      // In a real implementation, we would search for the clause title or a bookmark
      // and scroll to it.
      console.log(`Synchronizing ONLYOFFICE to clause: ${selectedClauseId}`);
      
      // Example call (requires specific document structure with bookmarks)
      // connectorRef.current.executeMethod("MoveToBookmark", [selectedClauseId]);
    }
  }, [selectedClauseId]);

  const onDocumentReady = () => {
    console.log("ONLYOFFICE Document is ready");
    // Get the connector to allow programmatic control
    // @ts-ignore
    const editor = window.DocEditor.instances['onlyoffice-editor'];
    if (editor) {
      connectorRef.current = editor.createConnector();
    }
  };

  const hostUrl = "http://10.0.1.168:3000";

  const getDocInfo = () => {
    // Force the working sample for all documents in the demo
    const file = "nda_dunder_original.docx";
    switch (activeDocumentId) {
      case 'doc-nda-1': return { title: "NDA.docx", file };
      case 'doc-dpa-1': return { title: "DPA.docx", file };
      case 'doc-msa-1': return { title: "MSA.docx", file };
      default: return { title: "Document.docx", file };
    }
  };

  const docInfo = getDocInfo();

  const config = {
    document: {
      fileType: "docx",
      key: `forced-v3-${activeDocumentId}-${activeRole}`, 
      title: docInfo.title,
      url: `${hostUrl}/samples/${docInfo.file}`,
    },
    documentType: "word",
    type: "embedded",
    editorConfig: {
      callbackUrl: `${hostUrl}/api/onlyoffice/callback`,
      user: {
        id: activeRole,
        name: activeRole === 'vendor' ? 'Sarah Chen (Vendor)' : 'James Whitfield (Client)',
      },
      mode: activeRole === 'sales' ? 'view' : 'edit',
      customization: {
        autosave: true,
        chat: false,
        comments: false,
        compactHeader: true,
        compactToolbar: false,
        help: false,
        hideNotes: false,
        hideRightMenu: false,
        hideRulers: false,
        showReviewChanges: true,
        status: true,
        toolbar: true,
      }
    },
    height: "100%",
    width: "100%",
  };

  return (
    <div className="h-full w-full border-none">
      <DocumentEditor
        id="onlyoffice-editor"
        documentServerUrl="http://localhost:8080/"
        config={config}
        onDocumentReady={onDocumentReady}
      />
    </div>
  );
}
