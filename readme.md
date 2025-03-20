

A comprehensive, configuration-driven settings management system for companies and users built with Next.js and React.


## Overview

This project provides a flexible, extensible settings management system that allows companies to:

- Manage company profile information and branding
- Configure notification preferences
- Set security policies
- Control data handling and retention
- Integrate with third-party services
- Customize display preferences
- Define operation-based workflows with configurable actions


The system is built with a configuration-driven architecture that makes it easy to add new settings or modify existing ones without changing the core code.

## Features

### Dynamic Settings Management

- **Configuration-Driven Forms**: All settings forms are generated from schema definitions
- **Validation**: Built-in validation using Zod schemas
- **Conditional Fields**: Fields can be shown/hidden based on other field values
- **File Uploads**: Support for image uploads with preview
- **Responsive Design**: Works on all device sizes


### Company Settings

- **Company Profile**: Name, description, logo, industry, etc.
- **Notifications**: Email preferences, notification types
- **Security**: Two-factor authentication, password policies, IP restrictions
- **Data Management**: Retention policies, backup settings, analytics preferences
- **Integrations**: Slack, Google Analytics, CRM systems, social login
- **Display**: Theme, date/time formats, language, timezone


### Personal Settings

- **Preferences**: Theme, font size, language, timezone
- **Notifications**: Email, browser, and mobile notification preferences
- **Accessibility**: Screen reader optimizations, contrast modes, animation settings


### Operations Configuration

- **Event-Based Actions**: Configure what happens when specific operations occur
- **Multiple Action Types**: Email, Slack, SMS notifications, webhooks, logging, analytics
- **Conditional Execution**: Enable/disable operations and actions as needed


## Technical Architecture

The system is built with a modular, configuration-driven architecture:

- **Schema Definitions**: Settings are defined as schemas with tabs, sections, and fields
- **Dynamic Form Rendering**: Forms are generated from schema definitions
- **Server Actions**: Next.js server actions handle data persistence
- **JSON Storage**: Settings are stored in JSON files (can be replaced with a database)
- **Revalidation**: Automatic cache revalidation when settings are updated


## Installation

1. Clone the repository:

```shellscript
git clone https://github.com/yourusername/company-settings.git
cd company-settings
```


2. Install dependencies:

```shellscript
npm install
```


3. Create the data directory:

```shellscript
mkdir -p data
```


4. Run the development server:

```shellscript
npm run dev
```


5. Open [http://localhost:3000](http://localhost:3000) in your browser


## Usage

### Accessing Settings

Navigate to `/settings` to access the settings dashboard. You can switch between company and personal settings using the tabs at the top.

### Modifying Settings Schemas

To add or modify settings, edit the schema definitions in `lib/settings-config.ts`:

```typescript
// Example: Adding a new field to company profile
{
  id: "profile.twitterHandle",
  type: "text",
  label: "Twitter Handle",
  description: "Your company's Twitter handle",
  placeholder: "@company",
}
```

### Adding New Settings Categories

To add a new settings category:

1. Add a new tab to the schema in `lib/settings-config.ts`
2. Define sections and fields for the new tab
3. Update the form validation schema if needed


### Customizing Operations

Operations and actions can be customized in `lib/operations-config.ts`:

```typescript
// Example: Adding a new operation type
"document.approved": {
  type: "document.approved",
  name: "Document Approved",
  description: "When a document is approved by a reviewer",
  enabled: true,
}
```

## File Structure

```plaintext
├── app/
│   ├── api/
│   │   └── settings/
│   │       └── route.ts       # API routes for settings
│   ├── settings/
│   │   └── page.tsx           # Settings page
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── company-settings-form.tsx      # Original form implementation
│   ├── company-settings-page.tsx      # Preview component
│   ├── dynamic-settings-form.tsx      # Configuration-driven form
│   ├── operations-settings.tsx        # Operations configuration UI
│   └── ui/                            # UI components
├── lib/
│   ├── operations-config.ts           # Operations configuration
│   ├── settings-actions.ts            # Server actions for settings
│   ├── settings-config.ts             # Settings schema definitions
│   └── settings-schema.ts             # Schema type definitions
├── data/
│   └── company-settings.json          # Stored settings (created at runtime)
└── public/
```

## Technologies Used

- **Next.js**: React framework with App Router
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: UI component library
- **Zod**: Schema validation
- **React Hook Form**: Form state management
- **Lucide React**: Icon library


## Extending the System

### Adding a Database

To replace the JSON file storage with a database:

1. Install your database client (e.g., `@prisma/client`)
2. Create database models for settings
3. Update the `settings-actions.ts` file to use the database instead of file storage


Example with Prisma:

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getCompanySettings() {
  return prisma.companySettings.findFirst({
    where: { id: 1 },
  })
}

export async function updateCompanySettings(settings: any) {
  return prisma.companySettings.upsert({
    where: { id: 1 },
    update: settings,
    create: { id: 1, ...settings },
  })
}
```

### Adding Authentication

This system can be integrated with authentication providers like NextAuth.js:

1. Install authentication library: `npm install next-auth`
2. Set up authentication providers
3. Add session checks to settings pages
4. Link personal settings to user accounts


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


---

Built with ❤️ using Next.js and React