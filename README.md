# What is xFAQs-Next?

xFAQs-next is a port of xFAQs from Firefox / Chrome extensions into an open domain userscript.

The current goal is to restore all functionality of xFAQs from before the changes to the message board engine.  Other side goals include cleaning up the code and possibly adding new functionality if ideas come up.

# Repository Contents

- xFAQs-Next.user.js: The xFAQs script itself.  If you're going to make changes to the userscript, you're probably making them in here.
- upload-v2.php: Server-side code for handling avatar display and upload.
- legacy: A directory containing the old xFAQs code from its days as a browser extension.  If you want to port a feature over, look in here for code you can copy across.

# Style Guidelines

- 4 spaces for indentation.  Not tabs.  Not 8 spaces.  Your editor may have the ability to convert tabs into spaces automatically.
- No trailing whitespace.  No lines containing only whitespace.  Don't include excessive amounts of whitespace within lines.
- K&R indentation. https://en.wikipedia.org/wiki/Indent_style#K.26R_style
- Semicolons at the end of lines
- Prefer single quotes for strings unless this would cause needless effort put into escaping the ' character within the string itself.
- lowercase-with-hyphens for class and id of HTML elements.  You can't always abide by this since gfaqs gets it wrong, but use this for elements that xFAQs inserts.