# Angular Zoneless UI Boilerplate

## Introduction

This boilerplate project provides a robust, ready-made architecture and a set of essential components to accelerate the development of Angular applications. It is designed to help teams save time by avoiding repetitive setup tasks and to ensure consistency across multiple projects within the company. Use this repository as a reference or starting point for new projects, ensuring best practices and a familiar structure for all developers.

## Notice

> **This project is proprietary and intended exclusively for internal use within My Busybee, Inc. Unauthorized copying, distribution, or use outside the company is strictly prohibited.**

## Demo

- **Live Demo:** [https://joenel-mybusybee.github.io/angular-zoneless-ui-boilerplate/](https://joenel-mybusybee.github.io/angular-zoneless-ui-boilerplate/)
- **Demo Login Credentials:**
  - **Username:** `emilys`
  - **Password:** `emilyspass`

## Technology Stack

- **Framework:** [Angular 20.1.0+](https://angular.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [SCSS](https://sass-lang.com/documentation/syntax/#scss), Bootstrap 5
- **Build Tool:** Angular CLI
- **Package Manager:** npm or pnpm

### Plugins & Libraries

- [RxJS](https://rxjs.dev/)
- [ng-bootstrap (Bootstrap 5)](https://ng-bootstrap.github.io/)
- [ngx-datatable](https://swimlane.gitbook.io/ngx-datatable)

## Architecture

This project uses a **zoneless architecture**, which means it does not rely on Angular's default Zone.js for change detection. Instead, it uses alternative strategies (such as manual change detection or signals) to improve performance and predictability.

- **Component-based structure:** Follows Angular’s modular architecture.
- **State Management:** RxJS
- **Routing:** Angular Router for SPA navigation.
- **API Communication:** HTTPClient for RESTful API calls.
- **Folder Structure:**

```
src/
  app/                    # Main application module and bootstrap logic
    components/           # All UI components
      pages/              # Page-level components (routed views)
        home/             # Home page components
        main/             # Admin panel pages components
        ...               # Other page components
      shared/             # Shared/reusable components
        common/           # Common UI elements (buttons, inputs, datatables, etc.)
        layout/           # Layout-related components
          home/           # Layout for home page (if necessary)
          main/           # Layout for admin panel
  core/                   # Core modules and singleton services
    constants/            # Application-wide constants
    guards/               # Route guards
    interceptors/         # HTTP interceptors
    models/               # TypeScript interfaces and models
    pipes/                # Custom pipes
    services/             # Singleton services
  assets/                 # Static assets (images, fonts, etc.)
  environments/           # Environment configuration files
  styles/                 # Global styles (SCSS)
```

## Features & Components

- **Landing Page & Authentication**: Basic landing page and login with API integration
- **Responsive Layouts:** Distinct layouts for both the home and admin panel, optimized for all device sizes.
- **Routing:** Pre-configured routes and dynamic sidebar for admin panel
- **Guards & Interceptors:** Built-in route guards and HTTP interceptors, including token expiration validation.
- **Reusable UI Components**: Flexible modal & toast
- **Data Table:** Customized implementation of _ngx-datatable_ for advanced, flexible tabular data presentation.

## API Resources

The current application uses **[dummyjson](https://dummyjson.com/docs)** API and interacts with the following API endpoints:

- Base Domain: https://dummyjson.com/

| Resource      | Endpoint      | Method | Description     |
| ------------- | ------------- | ------ | --------------- |
| Login         | `/auth/login` | GET    | Login           |
| Create Post   | `/post/add`   | POST   | Add a new Post  |
| Get All Posts | `/posts`      | GET    | Fetch all Posts |

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component path/to/directory/component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
# For production build
npm run build

# For development build
npm run build:local

# For staging build
npm run build:staging
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Feedback

We welcome your feedback and suggestions to help improve this boilerplate. If you have any ideas, issues, or enhancements, please feel free to open an issue or submit a pull request. Your contributions are greatly appreciated!

## Author

**Company:** My Busybee, Inc.  
**Website:** [https://mybusybee.net/](https://mybusybee.net)

This boilerplate is maintained by the **System Development Department** for internal use within **My Busybee, Inc.**.

For questions, suggestions, or contributions, please contact:  
**Email:** joenel@mybusybee.net

---

© 2025 My Busybee, Inc. All rights reserved.
