import React, { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { SubmitButton } from "@/components/common/button";
import Header from "@/components/common/header";
import { api } from "@/utils";

interface GameSettingsProps {
  onUpdate?: () => void;
}

const ChunithmSettingsPage: React.FC<GameSettingsProps> = ({ onUpdate }) => {
  const [chunithmVersion, setChunithmVersion] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [versions, setVersions] = useState<string[]>([]);

  const fetchCurrentVersion = async () => {
    try {
      const response = await api.chunithm.settings.get.$get();
      if (response.ok) {
        const data = await response.json();
        setChunithmVersion(data.version);
      }
    } catch (error) {
      console.error("Error fetching current version:", error);
    }
  };

  const fetchVersions = async () => {
    try {
      const response = await api.chunithm.settings.versions.$get();
      if (response.ok) {
        const data = await response.json();
        setVersions(data.versions);
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    }
  };

  useEffect(() => {
    fetchVersions();
    fetchCurrentVersion();
  }, []);

  useEffect(() => {
    fetchCurrentVersion();
  }, []);

  const handleVersionChange = (version: string) => {
    setChunithmVersion(version);
  };

  const handleDropdownToggle = (section: string) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const updateChunithmSettings = async () => {
    try {
      const response = await api.chunithm.settings.update.$post({
        json: { version: chunithmVersion },
      });
      if (response.ok) {
        const data = await response.json();
        setChunithmVersion(data.version);
        console.log("Updated Chunithm settings to version:", data.version);
      }
      onUpdate?.();
    } catch (error) {
      console.error("Error updating Chunithm settings:", error);
    }
  };

  return (
    <div className="relative flex-1 overflow-auto">
      <Header title={"Chunithm Settings"} />

      <motion.div
        className="flex w-full flex-col gap-4 px-4 pt-4 md:gap-8 md:pt-15"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Chunithm Section */}
        <div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-100">Chunithm Settings</h2>

          <div className="mb-4">
            <button
              onClick={() => handleDropdownToggle("chunithm-version")}
              className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
            >
              <span className="text-gray-200">Game Version: {chunithmVersion}</span>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  openDropdown === "chunithm-version" ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === "chunithm-version" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2"
                >
                  <div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
                    {versions.map((version) => (
                      <div
                        key={version}
                        onClick={() => handleVersionChange(version)}
                        className="cursor-pointer rounded-md bg-gray-700 p-2 transition-colors hover:bg-gray-600"
                      >
                        <span className="text-gray-200">Version {version}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <SubmitButton
            onClick={updateChunithmSettings}
            defaultLabel="Update Chunithm settings"
            updatingLabel="Updating..."
            className="bg-red-600 hover:bg-red-700"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ChunithmSettingsPage;
