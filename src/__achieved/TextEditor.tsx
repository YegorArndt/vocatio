// import {
//   forwardRef,
//   useEffect,
//   useImperativeHandle,
//   useRef,
//   useState,
// } from "react";
// import EditorJS, { type EditorConfig } from "@editorjs/editorjs";
// import Header from "@editorjs/header";
// // @ts-ignore
// import List from "@editorjs/list";
// import { isEqual } from "lodash-es";

// const { log } = console;

// type TextEditorProps = {
//   className?: string;
//   config?: EditorConfig;
// };

// const TextEditor = forwardRef((props: TextEditorProps, ref) => {
//   const { className, config: c } = props;
//   const [config, setConfig] = useState<EditorConfig>(c || {});

//   const editorRef = useRef(null);
//   const editorInstance = useRef<EditorJS | null>(null);

//   useImperativeHandle(ref, () => ({
//     getContent: async () => {
//       if (!editorInstance.current) return;

//       return await editorInstance.current.save().then((outputData) => {
//         return JSON.stringify(outputData);
//       });
//     },
//   }));

//   useEffect(() => {
//     if (editorRef.current && !editorInstance.current) {
//       editorInstance.current = new EditorJS({
//         holder: editorRef.current,
//         tools: {
//           header: Header,
//           list: List,
//         },
//         ...config,
//       });
//     }
//   }, []);

//   useEffect(() => {
//     if (isEqual(c, config)) return;

//     editorInstance.current?.destroy?.();
//     setConfig(c || {});
//     editorInstance.current = new EditorJS({
//       holder: editorRef.current!,
//       tools: {
//         header: Header,
//         list: List,
//       },
//       ...c,
//     });
//   }, [c]);

//   return (
//     <div id="editor" className={className}>
//       <div ref={editorRef} suppressHydrationWarning />
//       <style jsx global>{`
//         .ce-block {
//           white-space: pre-wrap;
//           height: 100%;
//           background: white;
//         }
//       `}</style>
//     </div>
//   );
// });

// export default TextEditor;
