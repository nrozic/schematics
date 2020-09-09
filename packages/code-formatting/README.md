# Code formatting

Code formatting is a custom schematic that will take care of setting up initial project configuration.
It will generate .editorconfig, install all required dev dependencies and it will add all required configuration files as well as husky hooks.

That way you don't have to worry about code formatting, you write the code the way you like, and rest will be taken care of on the fly.

# Installation

In order to install this package, first make sure that you are authorised for registry https://verdaccio.trilium.io
Run `npm i -D @trilium/code-formatting`

# Usage

There are 2 commands that you can use to invoke code formatting schematic: run `ng g @trilium/code-formatting:code-formatting` or `schematics @trilium/code-formatting:code-formatting` you will be prompted with few questions, andafter that schematic will do its magic

![Code formatting usage](https://asciinema.org/a/OxGBHmFXK6tovfBawBDw5EA7G)

That's it, your'e done. Congratulations and enjoy.
Happy coding!