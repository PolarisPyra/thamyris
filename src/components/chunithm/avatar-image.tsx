import React from "react";

export const AvatarImage = ({ clothing }: { clothing: any }) => (
	<div className="relative w-full md:w-[300px] h-[300px] md:h-[400px] mb-6 md:mb-0">
		<div className="avatar_base relative w-[300px] h-[400px]">
			<div className="avatar_back">
				<img loading="lazy" src={`/assets/avatar/${clothing.back}.png`} alt="Back" />
			</div>
			<div className="avatar_wear">
				<img loading="lazy" src={`/assets/avatar/${clothing.wear}.png`} alt="Body" />
			</div>
			<div className="avatar_skin">
				<img loading="lazy" src="/assets/avatarStatic/CHU_UI_Avatar_Tex_01400001.png" alt="Skin" />
			</div>
			<div className="avatar_hand_l">
				<img loading="lazy" src="/assets/avatarStatic/CHU_UI_Avatar_Tex_LeftHand.png" alt="Left Hand" />
			</div>
			<div className="avatar_hand_r">
				<img
					loading="lazy"
					src="/assets/avatarStatic/CHU_UI_Avatar_Tex_RightHand.png"
					alt="Right Hand"
				/>
			</div>
			<div className="avatar_head">
				<img loading="lazy" src={`/assets/avatar/${clothing.head}.png`} alt="Head" />
			</div>
			<div className="avatar_face_static">
				<img loading="lazy" src="/assets/avatarStatic/CHU_UI_Avatar_Tex_Face.png" alt="Static Face" />
			</div>
			<div className="avatar_face">
				<img loading="lazy" src={`/assets/avatar/${clothing.face}.png`} alt="Face" />
			</div>
			<div className="avatar_item_l">
				<img loading="lazy" src={`/assets/avatar/${clothing.item}.png`} alt="Left Accessory" />
			</div>
			<div className="avatar_item_r">
				<img src={`/assets/avatar/${clothing.item}.png`} alt="Right Accessory" />
			</div>
			<div className="avatar_skinfoot_l">
				<img loading="lazy" src="/assets/avatarStatic/CHU_UI_Avatar_Tex_01400001.png" alt="Left Foot" />
			</div>
			<div className="avatar_skinfoot_r">
				<img
					loading="lazy"
					src="/assets/avatarStatic/CHU_UI_Avatar_Tex_01400001.png"
					alt="Right Foot"
				/>
			</div>
		</div>
	</div>
);
