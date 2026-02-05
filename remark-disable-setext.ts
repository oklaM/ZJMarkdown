import type { Plugin } from 'unified';
import type { Root, Heading, Parent, Paragraph } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * Remark plugin that converts Setext-style headings to paragraphs.
 *
 * Setext headings are identified by checking if they have a `position` property
 * with multiple lines (the underline creates a second line).
 *
 * This plugin runs after parsing and converts any Setext heading nodes to paragraph nodes.
 */
export const remarkDisableSetext: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'heading', (node: Heading, index, parent) => {
      if (!parent || index === undefined) return;

      // Check if this is a Setext heading by examining the position
      // Setext headings have a position that spans multiple lines
      const position = node.position;
      if (!position) return;

      // Calculate the number of lines in the heading
      const lineCount = position.end.line - position.start.line + 1;

      // Setext headings typically span 2+ lines (text line + underline line)
      // ATX headings (using #) are on a single line
      if (lineCount >= 2) {
        // Convert this heading to a paragraph
        const paragraph: Paragraph = {
          type: 'paragraph',
          children: node.children
        };

        // Replace the heading with the paragraph
        (parent as Parent).children[index] = paragraph;

        console.log('[remarkDisableSetext] Converted Setext heading to paragraph');
      }
    });
  };
};

