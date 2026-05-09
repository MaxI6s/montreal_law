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

  const hostUrl = "http://host.docker.internal:3000";

  const getDocInfo = () => {
    switch (activeDocumentId) {
      case 'doc-nda-1': return { title: "NDA.docx", file: "nda.docx" };
      case 'doc-dpa-1': return { title: "DPA.docx", file: "dpa.docx" };
      case 'doc-msa-1': return { title: "MSA.docx", file: "msa.docx" };
      default: return { title: "Document.docx", file: "contract.docx" };
    }
  };

  const docInfo = getDocInfo();

  const config = {
    document: {
      fileType: "docx",
      key: `doc-${activeDocumentId}-${activeRole}`, 
      title: docInfo.title,
      url: `${hostUrl}/samples/${docInfo.file}`,
    },
    documentType: "word",
    editorConfig: {
      callbackUrl: `${hostUrl}/api/onlyoffice/callback`,
      user: {
        id: activeRole,
        name: activeRole === 'vendor' ? 'Sarah Chen (Vendor)' : 'James Whitfield (Client)',
      },
      mode: activeRole === 'sales' ? 'view' : 'edit',
      customization: {
        autosave: true,
        chat: true,
        comments: true,
        compactHeader: true,
        compactToolbar: false,
        help: false,
        hideNotes: false,
        hideRightMenu: false,
        showReviewChanges: true,
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
