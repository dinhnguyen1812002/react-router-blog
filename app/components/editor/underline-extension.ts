import { Mark, mergeAttributes } from "@tiptap/core";

export const Underline = Mark.create({
	name: "underline",

	parseHTML() {
		return [
			{ tag: "u" },
			{
				style: "text-decoration",
				getAttrs: (value) => value === "underline" && null,
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return ["u", mergeAttributes(HTMLAttributes), 0];
	},

	addCommands() {
		return {
			setUnderline:
				() =>
				({ commands }) =>
					commands.setMark(this.name),
			toggleUnderline:
				() =>
				({ commands }) =>
					commands.toggleMark(this.name),
			unsetUnderline:
				() =>
				({ commands }) =>
					commands.unsetMark(this.name),
		};
	},

	addKeyboardShortcuts() {
		return {
			"Mod-u": () => this.editor.commands.toggleUnderline(),
		};
	},
});
