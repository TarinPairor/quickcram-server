export const GoogleCalendarEvent = {
  type: "json_schema",
  json_schema: {
    name: "google_calendar_event",
    strict: false,
    schema: {
      type: "object",
      properties: {
        summary: {
          type: "string",
        },
        description: {
          type: "string",
        },
        location: {
          type: "string",
        },
        start: {
          type: "array",
          items: {
            type: "object",
            properties: {
              dateTime: {
                type: "string",
              },
            },
            required: ["dateTime"],
            additionalProperties: false,
          },
        },
        end: {
          type: "array",
          items: {
            type: "object",
            properties: {
              dateTime: {
                type: "string",
              },
            },
            required: ["dateTime"],
            additionalProperties: false,
          },
        },
      },
      additionalProperties: false,
      required: ["summary", "start", "end"],
    },
  },
};
