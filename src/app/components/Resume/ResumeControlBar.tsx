"use client";
import { useEffect, useState, useRef } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { exportResumeToYaml, downloadYamlFile, generateYamlFileName } from "lib/yaml-utils";
import type { Resume } from "lib/redux/types";
import type { Settings } from "lib/redux/settingsSlice";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
  resume,
  settings,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
  resume: Resume;
  settings: Settings;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [instance, update] = usePDF({ document });

  // Hook to update pdf when document changes
  useEffect(() => {
    if (update) {
      (update as any)();
    }
  }, [update, document]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    };

    window.document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDownloadYaml = () => {
    const yamlContent = exportResumeToYaml(resume, settings);
    const yamlFileName = generateYamlFileName(resume);
    downloadYamlFile(yamlContent, yamlFileName);
    setShowDownloadMenu(false);
  };

  const handleDownloadPdf = () => {
    if (instance.url) {
      const link = window.document.createElement('a');
      link.href = instance.url;
      link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      link.click();
    }
    setShowDownloadMenu(false);
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-center px-[var(--resume-padding)] text-gray-600 lg:justify-between">
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
        />
        <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden items-center gap-1 lg:flex">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none">Autoscale</span>
        </label>
      </div>
      <div className="relative" ref={menuRef}>
        <button
          className="ml-1 flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100 lg:ml-8"
          onClick={() => setShowDownloadMenu(!showDownloadMenu)}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">下载简历</span>
          <ChevronDownIcon className="h-3 w-3" />
        </button>
        
        {showDownloadMenu && (
          <div className="absolute right-0 bottom-full mb-2 bg-white border border-gray-300 rounded-md shadow-lg py-1 z-10 min-w-[140px]">
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              onClick={handleDownloadPdf}
            >
              下载PDF
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              onClick={handleDownloadYaml}
            >
              下载YAML
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
