// react-markdown 라이브러리 동작 X, 직접 구현
// 구현 기능 : 제목, 구분선, 리스트, 볼드체, 들여쓰기, 일반 텍스트
import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // 볼드체 처리
  const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.+?\*\*)/g);

    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const parseMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactElement[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // 빈 줄
      if (!trimmed) {
        elements.push(<div key={index} className="h-4" />);
        return;
      }

      // 제목
      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={index}
            className="mb-3 mt-6 text-xl font-semibold text-[#222A3A]"
          >
            {line.substring(4)}
          </h3>
        );
        return;
      }

      if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={index}
            className="mb-4 mt-8 text-2xl font-bold text-[#222A3A]"
          >
            {line.substring(3)}
          </h2>
        );
        return;
      }

      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={index}
            className="mb-6 mt-8 text-3xl font-bold text-[#222A3A]"
          >
            {line.substring(2)}
          </h1>
        );
        return;
      }

      // 구분선
      if (trimmed === "---") {
        elements.push(<hr key={index} className="my-8 border-gray-300" />);
        return;
      }

      // 들여쓰기된 불릿 리스트
      if (/^\s{2,}[-*]\s/.test(line)) {
        elements.push(
          <p key={index} className="mb-2 pl-12 text-gray-700">
            <span className="mr-2">◦</span>
            {parseBoldText(trimmed.substring(2))}
          </p>
        );
        return;
      }

      // 들여쓰기된 일반 텍스트 (가., 나., 다. 등)
      if (/^\s{4,}/.test(line)) {
        elements.push(
          <p key={index} className="mb-2 pl-12 text-gray-700">
            {parseBoldText(trimmed)}
          </p>
        );
        return;
      }

      // 숫자 리스트
      if (/^\d+\.\s/.test(line)) {
        elements.push(
          <p key={index} className="mb-2 pl-6 text-gray-700">
            <span className="mr-2">•</span>
            {parseBoldText(trimmed.replace(/^\d+\.\s/, ""))}
          </p>
        );
        return;
      }

      // 일반 불릿 리스트
      if (/^[-*]\s/.test(line)) {
        elements.push(
          <p key={index} className="mb-2 pl-6 text-gray-700">
            <span className="mr-2">•</span>
            {parseBoldText(trimmed.substring(2))}
          </p>
        );
        return;
      }

      // 일반 텍스트
      elements.push(
        <p key={index} className="mb-4 leading-relaxed text-gray-700">
          {parseBoldText(line)}
        </p>
      );
    });

    return elements;
  };

  return <div className="text-gray-700">{parseMarkdown(content)}</div>;
}
