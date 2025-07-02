import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { ErrorResponseSchema } from './auth.schema';
import { ProductSchema } from './product.schema';
import { ServiceRequestType, ServiceRequestStatus } from '../types';

// User Schema for service request relationships - Updated to match actual DB structure
export const UserInServiceRequestSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  phone: z.string(),
  email: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  alternativePhone: z.string().nullable().optional(),
  role: z.string(),
  franchiseAreaId: z.string().nullable().optional(),
  locationLatitude: z.number().nullable().optional(),
  locationLongitude: z.number().nullable().optional(),
  hasOnboarded: z.boolean().optional(),
  isActive: z.boolean(),
  firebaseUid: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Service Request Schema - Updated to handle images and assignedTo properly
export const ServiceRequestSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  productId: z.string(),
  orderId: z.string().optional().nullable(),
  type: z.enum(Object.values(ServiceRequestType) as [ServiceRequestType, ...ServiceRequestType[]]),
  description: z.string(),
  images: z.array(z.string()).optional().default([]), // Images as array of strings
  status: z.enum(Object.values(ServiceRequestStatus) as [ServiceRequestStatus, ...ServiceRequestStatus[]]),
  assignedToId: z.string().optional().nullable(),
  franchiseAreaId: z.string(),
  scheduledDate: z.string().optional().nullable(),
  completedDate: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  customer: UserInServiceRequestSchema.optional().nullable(),
  product: ProductSchema.optional().nullable(),
  assignedTo: UserInServiceRequestSchema.optional().nullable(),
});

// Create Service Request
export const CreateServiceRequestBodySchema = z.object({
  productId: z.string(),
  orderId: z.string().optional(),
  type: z.enum(Object.values(ServiceRequestType) as [ServiceRequestType, ...ServiceRequestType[]]),
  description: z.string().min(5),
  scheduledDate: z.string().optional(),
  images: z.array(z.string()).optional().default([]), // Images as array of strings
});
export const CreateServiceRequestResponseSchema = z.object({
  message: z.string(),
  serviceRequest: ServiceRequestSchema,
});
export const createServiceRequestSchema = {
  body: zodToJsonSchema(CreateServiceRequestBodySchema),
  response: {
    201: zodToJsonSchema(CreateServiceRequestResponseSchema),
    400: zodToJsonSchema(ErrorResponseSchema),
    404: zodToJsonSchema(ErrorResponseSchema),
  },
  tags: ["service-requests"],
  summary: "Create a new service request",
  description: "Create a new service request for a product/order",
  security: [{ bearerAuth: [] }],
};

// Get All Service Requests
export const GetAllServiceRequestsQuerySchema = z.object({
  status: z.enum(Object.values(ServiceRequestStatus) as [ServiceRequestStatus, ...ServiceRequestStatus[]]).optional(),
  type: z.enum(Object.values(ServiceRequestType) as [ServiceRequestType, ...ServiceRequestType[]]).optional(),
  franchiseAreaId: z.string().optional(),
});
export const GetAllServiceRequestsResponseSchema = z.object({
  serviceRequests: z.array(ServiceRequestSchema),
});
export const getAllServiceRequestsSchema = {
  querystring: zodToJsonSchema(GetAllServiceRequestsQuerySchema),
  response: {
    200: zodToJsonSchema(GetAllServiceRequestsResponseSchema),
    400: zodToJsonSchema(ErrorResponseSchema),
    403: zodToJsonSchema(ErrorResponseSchema),
  },
  tags: ["service-requests"],
  summary: "Get all service requests",
  description: "Get a list of all service requests (admin, franchise owner, or service agent)",
  security: [{ bearerAuth: [] }],
};

// Get Service Request by ID
export const GetServiceRequestByIdParamsSchema = z.object({
  id: z.string(),
});
export const GetServiceRequestByIdResponseSchema = z.object({
  serviceRequest: ServiceRequestSchema,
});
export const getServiceRequestByIdSchema = {
  params: zodToJsonSchema(GetServiceRequestByIdParamsSchema),
  response: {
    200: zodToJsonSchema(GetServiceRequestByIdResponseSchema),
    403: zodToJsonSchema(ErrorResponseSchema),
    404: zodToJsonSchema(ErrorResponseSchema),
  },
  tags: ["service-requests"],
  summary: "Get service request by ID",
  description: "Get a service request by its ID (permission checks in controller)",
  security: [{ bearerAuth: [] }],
};

// Update Service Request Status
export const UpdateServiceRequestStatusParamsSchema = z.object({
  id: z.string(),
});
export const UpdateServiceRequestStatusBodySchema = z.object({
  status: z.enum(Object.values(ServiceRequestStatus) as [ServiceRequestStatus, ...ServiceRequestStatus[]]),
});
export const UpdateServiceRequestStatusResponseSchema = z.object({
  message: z.string(),
  serviceRequest: ServiceRequestSchema,
});
export const updateServiceRequestStatusSchema = {
  params: zodToJsonSchema(UpdateServiceRequestStatusParamsSchema),
  body: zodToJsonSchema(UpdateServiceRequestStatusBodySchema),
  response: {
    200: zodToJsonSchema(UpdateServiceRequestStatusResponseSchema),
    400: zodToJsonSchema(ErrorResponseSchema),
    403: zodToJsonSchema(ErrorResponseSchema),
    404: zodToJsonSchema(ErrorResponseSchema),
  },
  tags: ["service-requests"],
  summary: "Update service request status",
  description: "Update the status of a service request (admin, franchise owner, or assigned agent)",
  security: [{ bearerAuth: [] }],
};

// Assign Service Agent
export const AssignServiceAgentParamsSchema = z.object({
  id: z.string(),
});
export const AssignServiceAgentBodySchema = z.object({
  assignedToId: z.string(),
});
export const AssignServiceAgentResponseSchema = z.object({
  message: z.string(),
  serviceRequest: ServiceRequestSchema,
});
export const assignServiceAgentSchema = {
  params: zodToJsonSchema(AssignServiceAgentParamsSchema),
  body: zodToJsonSchema(AssignServiceAgentBodySchema),
  response: {
    200: zodToJsonSchema(AssignServiceAgentResponseSchema),
    400: zodToJsonSchema(ErrorResponseSchema),
    403: zodToJsonSchema(ErrorResponseSchema),
    404: zodToJsonSchema(ErrorResponseSchema),
  },
  tags: ["service-requests"],
  summary: "Assign service agent to service request",
  description: "Assign a service agent to a service request (admin or franchise owner only)",
  security: [{ bearerAuth: [] }],
};

// Schedule Service Request - NEW SCHEMA
export const ScheduleServiceRequestParamsSchema = z.object({
  id: z.string(),
});
export const ScheduleServiceRequestBodySchema = z.object({
  scheduledDate: z.string(),
});
export const ScheduleServiceRequestResponseSchema = z.object({
  message: z.string(),
  serviceRequest: ServiceRequestSchema,
});
export const scheduleServiceRequestSchema = {
  params: zodToJsonSchema(ScheduleServiceRequestParamsSchema),
  body: zodToJsonSchema(ScheduleServiceRequestBodySchema),
  response: {
    200: zodToJsonSchema(ScheduleServiceRequestResponseSchema),
    400: zodToJsonSchema(ErrorResponseSchema),
    403: zodToJsonSchema(ErrorResponseSchema),
    404: zodToJsonSchema(ErrorResponseSchema),
  },
  tags: ["service-requests"],
  summary: "Schedule service request",
  description: "Schedule a service request for a specific date and time (admin, franchise owner, or assigned agent)",
  security: [{ bearerAuth: [] }],
};