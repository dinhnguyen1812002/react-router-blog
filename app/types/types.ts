// Fix: Added React import to resolve "Cannot find namespace 'React'" errors for ReactNode
import type React from "react";

export interface NavItem {
	label: string;
	href: string;
}

export interface ValueItem {
	id: string;
	title: string;
	description: string;
	icon: React.ReactNode;
}

export interface FeatureItem {
	id: string;
	title: string;
	description: string;
	icon: React.ReactNode;
}

export interface TeamMember {
	id: string;
	name: string;
	role: string;
	image: string;
	bio: string;
}

export interface StatItem {
	id: string;
	label: string;
	value: string;
	suffix: string;
}

export interface TestimonialItem {
	id: string;
	content: string;
	author: string;
	handle: string;
	avatar: string;
}

export interface ApiResponse<T> {
	data: T;
	message?: string;
	status?: number;
}

export interface PaginatedResponse<T> {
	content: T[];
	pageable: {
		pageNumber: number;
		pageSize: number;
		sort: {
			sorted: boolean;
			unsorted: boolean;
			empty: boolean;
		};
	};
	totalElements: number;
	totalPages: number;
	last: boolean;
	first: boolean;
	numberOfElements: number;
	size: number;
	number: number;
}
