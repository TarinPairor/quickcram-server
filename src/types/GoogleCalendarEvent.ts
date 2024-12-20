// export interface GoogleCalendarEvent {
//   kind: string;
//   etag: string;
//   id: string;
//   status: string;
//   htmlLink: string;
//   created: string;
//   updated: string;
//   summary: string;
//   description: string;
//   location: string;
//   colorId: string;
//   creator: {
//     id: string;
//     email: string;
//     displayName: string;
//     self: boolean;
//   };
//   organizer: {
//     id: string;
//     email: string;
//     displayName: string;
//     self: boolean;
//   };
//   start: {
//     date?: string;
//     dateTime?: string;
//     timeZone: string;
//   };
//   end: {
//     date?: string;
//     dateTime?: string;
//     timeZone: string;
//   };
//   endTimeUnspecified: boolean;
//   recurrence?: string[];
//   recurringEventId?: string;
//   originalStartTime?: {
//     date?: string;
//     dateTime?: string;
//     timeZone: string;
//   };
//   transparency: string;
//   visibility: string;
//   iCalUID: string;
//   sequence: number;
//   attendees?: {
//     id: string;
//     email: string;
//     displayName: string;
//     organizer: boolean;
//     self: boolean;
//     resource: boolean;
//     optional: boolean;
//     responseStatus: string;
//     comment?: string;
//     additionalGuests?: number;
//   }[];
//   attendeesOmitted?: boolean;
//   extendedProperties?: {
//     private?: { [key: string]: string };
//     shared?: { [key: string]: string };
//   };
//   hangoutLink?: string;
//   conferenceData?: {
//     createRequest?: {
//       requestId: string;
//       conferenceSolutionKey: {
//         type: string;
//       };
//       status: {
//         statusCode: string;
//       };
//     };
//     entryPoints?: {
//       entryPointType: string;
//       uri: string;
//       label: string;
//       pin?: string;
//       accessCode?: string;
//       meetingCode?: string;
//       passcode?: string;
//       password?: string;
//     }[];
//     conferenceSolution?: {
//       key: {
//         type: string;
//       };
//       name: string;
//       iconUri: string;
//     };
//     conferenceId: string;
//     signature: string;
//     notes?: string;
//   };
//   gadget?: {
//     type: string;
//     title: string;
//     link: string;
//     iconLink: string;
//     width: number;
//     height: number;
//     display: string;
//     preferences?: { [key: string]: string };
//   };
//   anyoneCanAddSelf?: boolean;
//   guestsCanInviteOthers?: boolean;
//   guestsCanModify?: boolean;
//   guestsCanSeeOtherGuests?: boolean;
//   privateCopy?: boolean;
//   locked?: boolean;
//   reminders?: {
//     useDefault: boolean;
//     overrides?: {
//       method: string;
//       minutes: number;
//     }[];
//   };
//   source?: {
//     url: string;
//     title: string;
//   };
//   workingLocationProperties?: {
//     type: string;
//     homeOffice?: any;
//     customLocation?: {
//       label: string;
//     };
//     officeLocation?: {
//       buildingId: string;
//       floorId: string;
//       floorSectionId: string;
//       deskId: string;
//       label: string;
//     };
//   };
//   outOfOfficeProperties?: {
//     autoDeclineMode: string;
//     declineMessage: string;
//   };
//   focusTimeProperties?: {
//     autoDeclineMode: string;
//     declineMessage: string;
//     chatStatus: string;
//   };
//   attachments?: {
//     fileUrl: string;
//     title: string;
//     mimeType: string;
//     iconLink: string;
//     fileId: string;
//   }[];
//   birthdayProperties?: {
//     contact: string;
//     type: string;
//     customTypeName?: string;
//   };
//   eventType: string;
// }

// export const googleCalendarEventSchema = {
//   type: "object",
//   properties: {
//     kind: { type: "string" },
//     etag: { type: "string" },
//     id: { type: "string" },
//     status: { type: "string" },
//     htmlLink: { type: "string" },
//     created: { type: "string" },
//     updated: { type: "string" },
//     summary: { type: "string" },
//     description: { type: "string" },
//     location: { type: "string" },
//     colorId: { type: "string" },
//     creator: {
//       type: "object",
//       properties: {
//         id: { type: "string" },
//         email: { type: "string" },
//         displayName: { type: "string" },
//         self: { type: "boolean" },
//       },
//       required: ["email"],
//     },
//     organizer: {
//       type: "object",
//       properties: {
//         id: { type: "string" },
//         email: { type: "string" },
//         displayName: { type: "string" },
//         self: { type: "boolean" },
//       },
//       required: ["email"],
//     },
//     start: {
//       type: "object",
//       properties: {
//         date: { type: "string" },
//         dateTime: { type: "string" },
//         timeZone: { type: "string" },
//       },
//       required: ["dateTime", "timeZone"],
//     },
//     end: {
//       type: "object",
//       properties: {
//         date: { type: "string" },
//         dateTime: { type: "string" },
//         timeZone: { type: "string" },
//       },
//       required: ["dateTime", "timeZone"],
//     },
//     endTimeUnspecified: { type: "boolean" },
//     recurrence: {
//       type: "array",
//       items: { type: "string" },
//     },
//     recurringEventId: { type: "string" },
//     originalStartTime: {
//       type: "object",
//       properties: {
//         date: { type: "string" },
//         dateTime: { type: "string" },
//         timeZone: { type: "string" },
//       },
//     },
//     transparency: { type: "string" },
//     visibility: { type: "string" },
//     iCalUID: { type: "string" },
//     sequence: { type: "integer" },
//     attendees: {
//       type: "array",
//       items: {
//         type: "object",
//         properties: {
//           id: { type: "string" },
//           email: { type: "string" },
//           displayName: { type: "string" },
//           organizer: { type: "boolean" },
//           self: { type: "boolean" },
//           resource: { type: "boolean" },
//           optional: { type: "boolean" },
//           responseStatus: { type: "string" },
//           comment: { type: "string" },
//           additionalGuests: { type: "integer" },
//         },
//         required: ["email"],
//       },
//     },
//     attendeesOmitted: { type: "boolean" },
//     extendedProperties: {
//       type: "object",
//       properties: {
//         private: {
//           type: "object",
//           additionalProperties: { type: "string" },
//         },
//         shared: {
//           type: "object",
//           additionalProperties: { type: "string" },
//         },
//       },
//     },
//     hangoutLink: { type: "string" },
//     conferenceData: {
//       type: "object",
//       properties: {
//         createRequest: {
//           type: "object",
//           properties: {
//             requestId: { type: "string" },
//             conferenceSolutionKey: {
//               type: "object",
//               properties: {
//                 type: { type: "string" },
//               },
//             },
//             status: {
//               type: "object",
//               properties: {
//                 statusCode: { type: "string" },
//               },
//             },
//           },
//         },
//         entryPoints: {
//           type: "array",
//           items: {
//             type: "object",
//             properties: {
//               entryPointType: { type: "string" },
//               uri: { type: "string" },
//               label: { type: "string" },
//               pin: { type: "string" },
//               accessCode: { type: "string" },
//               meetingCode: { type: "string" },
//               passcode: { type: "string" },
//               password: { type: "string" },
//             },
//           },
//         },
//         conferenceSolution: {
//           type: "object",
//           properties: {
//             key: {
//               type: "object",
//               properties: {
//                 type: { type: "string" },
//               },
//             },
//             name: { type: "string" },
//             iconUri: { type: "string" },
//           },
//         },
//         conferenceId: { type: "string" },
//         signature: { type: "string" },
//         notes: { type: "string" },
//       },
//     },
//     gadget: {
//       type: "object",
//       properties: {
//         type: { type: "string" },
//         title: { type: "string" },
//         link: { type: "string" },
//         iconLink: { type: "string" },
//         width: { type: "integer" },
//         height: { type: "integer" },
//         display: { type: "string" },
//         preferences: {
//           type: "object",
//           additionalProperties: { type: "string" },
//         },
//       },
//     },
//     anyoneCanAddSelf: { type: "boolean" },
//     guestsCanInviteOthers: { type: "boolean" },
//     guestsCanModify: { type: "boolean" },
//     guestsCanSeeOtherGuests: { type: "boolean" },
//     privateCopy: { type: "boolean" },
//     locked: { type: "boolean" },
//     reminders: {
//       type: "object",
//       properties: {
//         useDefault: { type: "boolean" },
//         overrides: {
//           type: "array",
//           items: {
//             type: "object",
//             properties: {
//               method: { type: "string" },
//               minutes: { type: "integer" },
//             },
//           },
//         },
//       },
//     },
//     source: {
//       type: "object",
//       properties: {
//         url: { type: "string" },
//         title: { type: "string" },
//       },
//     },
//     workingLocationProperties: {
//       type: "object",
//       properties: {
//         type: { type: "string" },
//         homeOffice: { type: "object" },
//         customLocation: {
//           type: "object",
//           properties: {
//             label: { type: "string" },
//           },
//         },
//         officeLocation: {
//           type: "object",
//           properties: {
//             buildingId: { type: "string" },
//             floorId: { type: "string" },
//             floorSectionId: { type: "string" },
//             deskId: { type: "string" },
//             label: { type: "string" },
//           },
//         },
//       },
//     },
//     outOfOfficeProperties: {
//       type: "object",
//       properties: {
//         autoDeclineMode: { type: "string" },
//         declineMessage: { type: "string" },
//       },
//     },
//     focusTimeProperties: {
//       type: "object",
//       properties: {
//         autoDeclineMode: { type: "string" },
//         declineMessage: { type: "string" },
//         chatStatus: { type: "string" },
//       },
//     },
//     attachments: {
//       type: "array",
//       items: {
//         type: "object",
//         properties: {
//           fileUrl: { type: "string" },
//           title: { type: "string" },
//           mimeType: { type: "string" },
//           iconLink: { type: "string" },
//           fileId: { type: "string" },
//         },
//       },
//     },
//     birthdayProperties: {
//       type: "object",
//       properties: {
//         contact: { type: "string" },
//         type: { type: "string" },
//         customTypeName: { type: "string" },
//       },
//     },
//     eventType: { type: "string" },
//   },
//   required: [
//     "kind",
//     "etag",
//     "id",
//     "status",
//     "htmlLink",
//     "created",
//     "updated",
//     "summary",
//     "start",
//     "end",
//   ],
//   additionalProperties: false,
// };
