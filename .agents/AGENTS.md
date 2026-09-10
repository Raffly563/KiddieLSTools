<!-- BEGIN:ui-guidelines -->
# UI / UX Design Guidelines

**CRITICAL RULE: DO NOT DEVIATE FROM THESE DESIGN PRINCIPLES IN FUTURE UPDATES.**

This project uses a highly specific **"Sleek Modern Tech / Admin Portal"** aesthetic. Any future AI modifications or component additions MUST adhere strictly to these rules:

1. **Color Palette (AMOLED / Zinc)**:
   - **Background**: Pure AMOLED Black (`#000000`).
   - **Cards & Surfaces**: Deep Zinc (`#09090b`).
   - **Borders & Dividers**: Dark Zinc (`#18181b`).
   - **Primary Accent**: Amber (`#f59e0b`) for buttons, badges, and highlights.
   - **Text (Foreground)**: Pure White (`#ffffff` or `#fafafa`) for maximum contrast.

2. **Styling Rules**:
   - **NO GLOW / NO BLUR**: Do NOT use `radial-gradient`, `box-shadow` glows, or heavy `backdrop-blur`. Keep surfaces solid and flat.
   - **Rounded Corners**: Use a subtle border radius of `0.5rem` (`rounded-lg` or `--radius: 0.5rem` in globals.css). Do NOT use sharp brutalist corners (`rounded-none`).
   - **Borders**: All cards, inputs, and layout containers must have a subtle 1px border (`border-border`).

3. **Typography**:
   - Primary Font: **Outfit** (sans-serif).
   - Ensure the Next.js font variable (`var(--font-outfit)`) is correctly passed to the `html` tag.

4. **Layout Structure**:
   - Always maintain the **Admin Portal** layout structure: A persistent left Sidebar and a sticky Top Navbar (Header).
   - Ensure high data density (compact padding, tabular data) typical of professional developer tools.
<!-- END:ui-guidelines -->
