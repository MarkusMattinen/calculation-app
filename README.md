# CalculationApp

Demo: https://calculation-app-ruby.vercel.app/

This is a demo app acting as a proof-of-concept for a control value calculator.
Basically the control value calculator is a tool for defining control values (named variables of any type).
The control values can either be standalone or have formulas defined to calculate them from other control values.

At a high level the calculator can appear somewhat similar to how a spreadsheet software works.
This calculator however gives the user much more fine-grained ability to define handling for dependencies, calculation loops, and errors.
At the calculator's core is a calculation loop that updates the values whenever the inputs change.
Internally it uses deduplication to ensure that calculations are only done when actually relevant values have changed, and to avoid going into endless calculation loops.

The calculator is designed so that new control values and their calculation formulas can be easily defined with a method chaining interface (similar to a builder pattern), with extensive TypeScript typing.
The calculator's public API also offers full TypeScript typing (even for string parameters), as well as both RxJS Observable and synchronous interfaces for reading and updating values.
This makes it very easy to bind the calculator to a form, as can be seen in the demo app.

The demo app has some basic warehouse management control values defined, but the control value calculator can easily be extended to support basically anything that can be defined as variables and formulas.
For example anything related to business, mathematics, physics, chemistry, etc.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
