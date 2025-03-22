import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import Spinner from "@/components/common/spinner";
import { useCurrentArcade, useUpdateArcadeLocation } from "@/hooks/users";
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
	const { data: currentArcade, isLoading } = useCurrentArcade();
	const { mutate: updateArcadeLocation, isPending } = useUpdateArcadeLocation();
	const [isUpdating, setIsUpdating] = useState(false);
	const [selectedArcadeIndex, setSelectedArcadeIndex] = useState(0);
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

	const handleSubmit = () => {
		if (!selectedCountry || !selectedState || !currentArcade || currentArcade.length === 0) {
			return;
		}

		const arcade = currentArcade[selectedArcadeIndex];

		setIsUpdating(true);
		updateArcadeLocation(
			{
				arcade: arcade.id,
				country: selectedCountry,
				state: selectedState.state,
				regionId: selectedState.regionId,
			},
			{
				onSuccess: () => {
					setIsUpdating(false);
				},
				onError: (error) => {
					console.error("Failed to update arcade location:", error);
					setIsUpdating(false);
				},
			}
		);
	};

	return (
		<div className="bg-card rounded-md p-6">
			<h2 className="text-primary mb-2 text-xl font-semibold">
				Change arcade location
				{isLoading ? (
					<span className="ml-2">
						<Spinner size={16} />
					</span>
				) : currentArcade && currentArcade.length > 0 ? (
					<span className="text-primary-muted ml-2 font-normal">
						for {currentArcade[selectedArcadeIndex]?.name}
						{currentArcade.length > 1 && (
							<select
								className="bg-dropdown ml-2 rounded p-1 text-sm"
								value={selectedArcadeIndex}
								onChange={(e) => setSelectedArcadeIndex(Number(e.target.value))}
							>
								{currentArcade.map((arcade, idx) => (
									<option key={idx} value={idx}>
										{arcade.name}
									</option>
								))}
							</select>
						)}
					</span>
				) : null}
			</h2>

			{!isLoading && (!currentArcade || currentArcade.length === 0) ? (
				<div className="mb-4 rounded-md bg-amber-50 p-4 dark:bg-amber-900/30">
					<div className="flex">
						<div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
							<p>
								You currently have no arcade tied to your account. Please contact{" "}
								<span className="bg-ping rounded-md px-1.5 py-0.5 font-medium text-white">@PolarisPyra</span> or{" "}
								<span className="bg-ping rounded-md px-1.5 py-0.5 font-medium text-white">@azui.573</span> to get your assigned
								arcade back.
							</p>
						</div>
					</div>
				</div>
			) : (
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

					<button
						onClick={handleSubmit}
						disabled={!selectedCountry || !selectedState || isPending || isLoading || !currentArcade?.length}
						className={`mt-4 rounded-md px-4 py-2 font-medium transition-colors ${
							!selectedCountry || !selectedState || isPending || isLoading || !currentArcade?.length
								? "bg-button text-gray-primary cursor-not-allowed disabled:opacity-50"
								: "bg-button hover:bg-buttonhover text-primary"
						}`}
					>
						{isPending || isUpdating ? (
							<span className="flex items-center">
								<Spinner size={16} className="mr-2" />
								Updating...
							</span>
						) : (
							"Update Location"
						)}
					</button>
				</div>
			)}
		</div>
	);
};

export default ArcadeConfiguration;
