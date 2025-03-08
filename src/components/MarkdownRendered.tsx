// import React from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

// // Custom component to render for [[note-name.md]] pattern
// const NoteLink = ({ noteFileName }) => (
//     <a
//         className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
//         href={`/notes/${noteFileName}`}
//     >
//         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//         </svg>
//         {noteFileName.replace(".md", "")}
//     </a>
// );

// // Custom component for text nodes that handles the pattern replacement
// const CustomText = ({ children }: { children: string }) => {
//     if (typeof children !== "string") return children;

//     const pattern = /\[\[(.*?\.md)\]\]/g;
//     if (!pattern.test(children)) return children;

//     // Split by the pattern and create an array of elements
//     const parts = [];
//     let lastIndex = 0;
//     let match;

//     // Create a new regexp for each iteration to reset the lastIndex
//     const regex = new RegExp(pattern);

//     while ((match = regex.exec(children)) !== null) {
//         // Add text before the match
//         if (match.index > lastIndex) {
//             parts.push(children.substring(lastIndex, match.index));
//         }

//         // Add the note link component
//         const noteFileName = match[1]; // Capture group for file name
//         parts.push(<NoteLink key={`note-${parts.length}`} noteFileName={noteFileName} />);

//         lastIndex = regex.lastIndex;
//     }

//     // Add any remaining text
//     if (lastIndex < children.length) {
//         parts.push(children.substring(lastIndex));
//     }

//     return <>{parts}</>;
// };

// const MarkdownRenderer = ({ message }: { message: { content: string }}) => {
//     return (
//         <ReactMarkdown
//             remarkPlugins={[remarkGfm]}
//             components={{
//                 text: CustomText
//             }}
//         >
//             {message.content}
//         </ReactMarkdown>
//     );
// };

// export default MarkdownRenderer;