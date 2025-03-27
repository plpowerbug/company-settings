

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


## Project Structure

```plaintext
company-settings/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   │   ├── actions/        # Action-related endpoints
│   │   ├── operations/     # Operation-related endpoints
│   │   └── settings/       # Settings endpoints
│   ├── settings/           # Settings page
│   └── page.tsx            # Home page (redirects to settings)
├── components/             # React components
│   ├── ui/                 # UI components (shadcn/ui)
│   ├── company-settings-form.tsx
│   ├── dynamic-settings-form.tsx
│   └── operations-settings.tsx
├── lib/                    # Utility functions and business logic
│   ├── operations-api.ts   # API client for operations
│   ├── operations-config.ts # Operation configuration
│   ├── operations-db.ts    # Database operations
│   ├── prisma.ts           # Prisma client
│   ├── settings-actions.ts # Server actions for settings
│   ├── settings-config.ts  # Settings configuration
│   └── settings-schema.ts  # Form schemas
├── prisma/                 # Prisma ORM
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seed script
├── public/                 # Static assets
├── .env                    # Environment variables
├── .env.example            # Example environment variables
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## API Documentation

### Operations API

#### GET /api/operations

- **Description**: Fetch all operations for the company
- **Response**: Array of operations with their actions


#### PATCH /api/operations/[id]

- **Description**: Update an operation
- **Parameters**:

- `id`: Operation ID



- **Request Body**:

- `updateType`: Type of update ('toggle', 'config', or general update)
- `enabled`: Boolean (for toggle updates)
- `config`: Object (for config updates)



- **Response**: Updated operation


### Actions API

#### POST /api/actions

- **Description**: Add a new action to an operation
- **Request Body**:

- `operationId`: ID of the operation
- `action`: Action data



- **Response**: Created action


#### PATCH /api/actions/[id]

- **Description**: Update an action
- **Parameters**:

- `id`: Action ID



- **Request Body**:

- `updateType`: Type of update ('toggle' or 'config')
- `enabled`: Boolean (for toggle updates)
- `config`: Object (for config updates)



- **Response**: Updated action


#### DELETE /api/actions/[id]

- **Description**: Remove an action
- **Parameters**:

- `id`: Action ID



- **Response**: Success message


## Data Structure

The application uses a hierarchical data structure:

1. **Company**: The top-level entity that owns operations
2. **Operation**: Represents a notification channel (email, SMS, etc.)
3. **Action**: Represents events that trigger notifications through channels


Each operation has its own configuration (like email settings) and contains multiple actions. Each action also has its own configuration (like notification content).

## Troubleshooting

### Unique Constraint Error During Seeding

If you encounter a unique constraint error when running the seed script:

```plaintext
PrismaClientKnownRequestError: Unique constraint failed on the constraint: `Action_operationId_type_key`
```

Modify your `prisma/seed.ts` file to ensure unique action types per operation:

```typescript
// Inside the main function
for (const operation of defaultOperations) {
  const { actions, ...operationData } = operation
  
  // Ensure unique action types by using a Map to deduplicate
  const uniqueActions = new Map()
  
  // Only keep the last action of each type
  actions.forEach(action => {
    uniqueActions.set(action.type, action)
  })
  
  // Convert back to array
  const uniqueActionsArray = Array.from(uniqueActions.values())
  
  await prisma.operation.create({
    data: {
      ...operationData,
      companyId: company.id,
      actions: {
        create: uniqueActionsArray.map(action => ({
          type: action.type,
          name: action.name,
          description: action.description,
          enabled: action.enabled,
          config: action.config
        }))
      }
    }
  })
}
```

### Database Connection Issues

If you're having trouble connecting to the database:

1. Verify your MySQL service is running
2. Check your `.env` file for correct credentials
3. Ensure your database user has the necessary permissions
4. Try running `npx prisma db push` to sync the schema without migrations


## Future Enhancements

- User authentication and authorization
- Multi-tenant support for multiple companies
- Audit logging for settings changes
- Notification templates management
- Integration with actual notification services (SendGrid, Twilio, etc.)
- User management interface


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


```plaintext

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