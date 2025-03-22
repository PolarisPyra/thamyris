import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import localeData from "@/utils/locale.json";

type State = {
	state: string;
	regionId: number;
};

type CountryOption = string;

interface CountryDropdownProps {
	label: string;
	options: CountryOption[];
	value: string | null;
	placeholder: string;
	onChange: (option: CountryOption) => void;
}

interface StateDropdownProps {
	label: string;
	options: State[];
	value: string | null;
	placeholder: string;
	onChange: (option: State) => void;
}

const CountryDropdown = ({ label, options, value, placeholder, onChange }: CountryDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="mb-4">
			<label className="text-primary block pb-2 text-sm font-medium">{label}</label>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="bg-dropdown hover:bg-dropdownhover flex w-full items-center justify-between rounded-md p-3 transition-colors"
			>
				<span className="text-primary truncate">{value || placeholder}</span>
				<ChevronDown className={`text-primary h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="mt-2 overflow-hidden"
					>
						<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
							{options.map((option, index) => (
								<div
									key={index}
									onClick={() => {
										onChange(option);
										setIsOpen(false);
									}}
									className="bg-dropdown hover:bg-dropdownhover cursor-pointer overflow-x-hidden rounded-md p-2 transition-colors"
								>
									<span className="text-primary">{option}</span>
								</div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
const StateDropdown = ({ label, options, value, placeholder, onChange }: StateDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="mb-4">
			<label className="text-primary block pb-2 text-sm font-medium">{label}</label>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="bg-dropdown hover:bg-dropdownhover flex w-full items-center justify-between rounded-md p-3 transition-colors"
			>
				<span className="text-primary truncate">{value || placeholder}</span>
				<ChevronDown className={`text-primary h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="mt-2 overflow-hidden"
					>
						<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
							{options.map((option, index) => (
								<div
									key={index}
									onClick={() => {
										onChange(option);
										setIsOpen(false);
									}}
									className="bg-dropdown hover:bg-dropdownhover cursor-pointer overflow-x-hidden rounded-md p-2 transition-colors"
								>
									<div className="flex justify-between">
										<span className="text-primary">{option.state}</span>
										<span className="text-primary-muted text-sm">ID: {option.regionId}</span>
									</div>
								</div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const ArcadeConfiguration = () => {
	const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
	const [selectedState, setSelectedState] = useState<State | null>(null);

	const getUniqueCountries = (): CountryOption[] => {
		const uniqueCountries = new Set<string>();

		for (const region of localeData.region0) {
			const country = region[0] as string;
			if (country) {
				uniqueCountries.add(country);
			}
		}

		return Array.from(uniqueCountries);
	};

	const countries: CountryOption[] = getUniqueCountries();

	const getStatesForCountry = (country: string | null): State[] => {
		if (!country) return [];

		const result: State[] = [];

		for (const region of localeData.region0) {
			const regionCountry = region[0] as string;
			if (regionCountry === country) {
				result.push({
					state: region[2] as string,
					regionId: region[1] as number,
				});
			}
		}

		return result;
	};

	const states: State[] = getStatesForCountry(selectedCountry);

	const handleCountryChange = (country: CountryOption) => {
		setSelectedCountry(country);
		setSelectedState(null);
		console.log(`Selected Country: ${country}`);
	};

	const handleStateChange = (state: State) => {
		setSelectedState(state);
		console.log("Selected State:", state.state);
		console.log("Region ID:", state.regionId);
	};

	const getStateDisplayValue = (): string | null => {
		return selectedState ? selectedState.state : null;
	};

	return (
		<div className="bg-card rounded-md p-6">
			<h2 className="text-primary mb-2 text-xl font-semibold">Change arcade location</h2>
			<div className="text-primary mb-4 text-sm">
				<CountryDropdown
					label="Country"
					options={countries}
					value={selectedCountry}
					placeholder="Select Country"
					onChange={handleCountryChange}
				/>

				{selectedCountry && (
					<StateDropdown
						label="State"
						options={states}
						value={getStateDisplayValue()}
						placeholder="Select State"
						onChange={handleStateChange}
					/>
				)}
			</div>
		</div>
	);
};

export default ArcadeConfiguration;
