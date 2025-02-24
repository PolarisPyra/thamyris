import { cdnUrl } from "@/lib/cdn";
import React from "react";

export const AvatarImage = ({ clothing }: { clothing: any }) => (
	<div className="relative w-full md:w-[300px] h-[300px] md:h-[400px] mb-6 md:mb-0">
		<div className="avatar_base relative w-[300px] h-[400px]">
			<div className="avatar_back">
				<img loading="lazy" src={`${cdnUrl}assets/avatar/${clothing.back}.png`} />
			</div>
			<div className="avatar_wear">
				<img loading="lazy" src={`${cdnUrl}assets/avatar/${clothing.wear}.png`} />
			</div>
			<div className="avatar_skin">
				<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_01400001.png`} />
			</div>
			<div className="avatar_hand_l">
				<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_LeftHand.png`} />
			</div>
			<div className="avatar_hand_r">
				<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_RightHand.png`} />
			</div>
			<div className="avatar_head">
				<img loading="lazy" src={`${cdnUrl}assets/avatar/${clothing.head}.png`} />
			</div>
			<div className="avatar_face_static">
				<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_Face.png`} />
			</div>
			<div className="avatar_face">
				<img loading="lazy" src={`${cdnUrl}assets/avatar/${clothing.face}.png`} />
			</div>
			<div className="avatar_item_l">
				<img loading="lazy" src={`${cdnUrl}assets/avatar/${clothing.item}.png`} />
			</div>
			<div className="avatar_item_r">
				<img loading="lazy" src={`${cdnUrl}assets/avatar/${clothing.item}.png`} />
			</div>
			<div className="avatar_skinfoot_l">
				<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_01400001.png`} />
			</div>
			<div className="avatar_skinfoot_r">
				<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_01400001.png`} />
			</div>
		</div>
	</div>
);
