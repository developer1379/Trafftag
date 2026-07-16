TRAFFTAG

Software Requirements Specification (SRS)

Document Version: 1.0Project Name: TRAFFTAG – Smart Vehicle Notification PlatformDocument Type: Software Requirements Specification (IEEE 29148 Inspired)Prepared By: Solution Architecture TeamDate: July 2026



Table of Contents

Introduction 

Purpose 

Scope 

Definitions & Acronyms 

Overall System Description 

Product Perspective 

Product Functions 

User Roles 

Functional Requirements 

Non-Functional Requirements 

Business Rules 

Security Requirements 

External Integrations 

System Constraints 

Assumptions 

Acceptance Criteria 



1. Introduction

TRAFFTAG is a secure Software-as-a-Service (SaaS) platform that enables anonymous communication between members of the public and vehicle owners using QR technology. The system is designed to improve road safety, reduce inconvenience, and protect user privacy.

This Software Requirements Specification (SRS) defines the functional, technical, and operational requirements for the TRAFFTAG platform.



2. Purpose

The purpose of this document is to:

Define system functionality. 

Establish a shared understanding among stakeholders. 

Serve as the baseline for software development. 

Support system testing and validation. 

Provide a reference for future maintenance and enhancements. 



3. Scope

The system includes:

Public website 

Customer portal 

Admin portal 

QR tag lifecycle management 

Vehicle management 

Membership management 

Payment processing 

Referral program 

Notification engine 

Analytics and reporting 



4. Definitions & Acronyms

Term

Description

QR Tag

Unique QR code assigned to a vehicle

Finder

Individual who scans a TRAFFTAG QR code

Owner

Registered user who owns the vehicle

Notification

Message sent to a vehicle owner

Membership

Subscription providing platform benefits

Admin

Authorized personnel managing the platform

SaaS

Software as a Service

RBAC

Role-Based Access Control

OTP

One-Time Password

API

Application Programming Interface



5. Overall System Description

The platform consists of four primary components:

Public Website 

Customer Portal 

Admin Portal 

Backend Services 

These components interact through secure REST APIs, a centralized SQL database, and third-party services for payments, messaging, and email.



6. Product Perspective

High-Level Architecture

                        +----------------------+

                        |   Public Website     |

                        +----------+-----------+

                                   |

                                   v

                        +----------------------+

                        |    REST API Layer    |

                        +----------+-----------+

                                   |

             +---------------------+----------------------+

             |                     |                      |

             v                     v                      v

      Authentication       Notification Engine     Membership Service

             |                     |                      |

             +---------------------+----------------------+

                                   |

                                   v

                         SQL Server Database

                                   |

          +------------------------+------------------------+

          |                         |                        |

          v                         v                        v

      Stripe Payment            Twilio SMS           Email Provider



7. Product Functions

The platform provides the following major functions:

User registration and authentication 

Vehicle registration and management 

QR tag activation and management 

Anonymous notification delivery 

Membership subscription handling 

Referral rewards 

Customer support 

Payment processing 

Administrative reporting 

Platform configuration 



8. User Roles

8.1 Visitor

Permissions:

Browse website 

View pricing 

Read FAQs 

Purchase tags 

Register account 

Contact support 

Restrictions:

Cannot manage vehicles 

Cannot activate tags 

Cannot receive notifications 



8.2 Registered Customer

Permissions:

Manage profile 

Register vehicles 

Activate tags 

View notifications 

Manage membership 

Purchase additional tags 

Refer friends 

View rewards 



8.3 Fleet Manager

Permissions:

Manage multiple vehicles 

Assign tags 

View fleet notifications 

Generate reports 

Manage employees 



8.4 Customer Support Agent

Permissions:

View users 

Reset memberships 

Assist customers 

Manage tickets 

Restrictions:

Cannot modify system settings 

Cannot delete users 



8.5 Administrator

Full system access including:

Users 

Vehicles 

QR Tags 

Memberships 

Notifications 

Payments 

Reports 

Analytics 

Settings 

Roles 

Permissions 

CMS 



9. Functional Requirements

Each functional requirement is assigned a unique identifier for traceability.



Module 1 – User Authentication

FR-AUTH-001

The system shall allow users to register using:

First Name 

Last Name 

Email 

Password 

Phone Number 

Priority: High



FR-AUTH-002

The system shall verify email ownership before account activation.

Priority: High



FR-AUTH-003

The system shall support secure login using:

Email 

Password 

Priority: High



FR-AUTH-004

The system shall support "Forgot Password" via secure email link.

Priority: High



FR-AUTH-005

Passwords shall be encrypted using industry-standard hashing algorithms (e.g., Argon2 or bcrypt).

Priority: Critical



FR-AUTH-006

The system shall automatically lock accounts after five consecutive failed login attempts within a configurable time window.

Priority: Medium



FR-AUTH-007

The system shall support Multi-Factor Authentication (MFA) as an optional security feature.

Priority: Medium



Module 2 – User Profile

FR-PROFILE-001

Users shall be able to:

Update personal details 

Change password 

Upload profile image 

Manage notification preferences 



FR-PROFILE-002

Users shall view:

Membership status 

Registered vehicles 

Active tags 

Referral code 

Reward balance 



Module 3 – Vehicle Management

FR-VEHICLE-001

A customer shall register one or more vehicles.



FR-VEHICLE-002

Vehicle details shall include:

Make 

Model 

Year 

License Plate 

State/Province 

Color 

VIN (optional) 



FR-VEHICLE-003

Each vehicle shall be linked to a single active TRAFFTAG.



FR-VEHICLE-004

The system shall prevent assignment of the same active QR tag to multiple vehicles.



FR-VEHICLE-005

Customers shall edit, archive, or remove vehicles, subject to business rules regarding active tags and notification history.



Module 4 – QR Tag Management

FR-TAG-001

The system shall generate a globally unique TRAFFTAG identifier.



FR-TAG-002

Each tag shall have:

QR Code 

Serial Number 

Activation Status 

Creation Date 

Activation Date 

Assigned Vehicle 



FR-TAG-003

Customers shall activate tags by entering the tag serial number or scanning the activation QR code.



FR-TAG-004

The system shall validate that the tag has not already been activated or reported as lost/stolen before activation.



FR-TAG-005

Administrators shall be able to deactivate, replace, or transfer tags under approved workflows.



Module 5 – QR Scan & Notification

FR-NOTIFY-001

When a QR code is scanned, the system shall display a secure notification form without revealing the vehicle owner's personal information.



FR-NOTIFY-002

The finder shall be able to select a notification category, such as:

Headlights On 

Window Open 

Flat Tire 

Parking Issue 

Vehicle Damage 

Emergency 

Other 



FR-NOTIFY-003

The finder may enter an optional free-text message and an optional contact number.



FR-NOTIFY-004

The system shall validate submissions using CAPTCHA and rate limiting to reduce spam and abuse.



FR-NOTIFY-005

Upon successful submission, the system shall deliver the notification through the configured communication channels (email, SMS, and/or push notification) based on the owner's preferences and membership level.



Requirements Traceability

Each requirement in this SRS will be assigned a unique identifier (e.g., FR-AUTH-001, FR-TAG-003) to enable traceability through design, development, testing, and maintenance.



End of SRS – Part 1

This section establishes the foundation of the functional requirements, covering authentication, user management, vehicle management, QR tag lifecycle, and the notification workflow.

Part 2 – Business Modules & Platform Operations



10. Membership Management Module

Module Overview

The Membership Management Module governs subscription plans, feature access, billing cycles, renewals, and customer entitlements. It ensures that users receive the correct platform features based on their active subscription.



Objectives

Support multiple membership tiers 

Manage recurring subscriptions 

Handle renewals and expirations 

Track customer benefits 

Integrate with payment gateways 



Membership Types

Free Plan

Purpose:

Allow users to register and explore the platform before subscribing. 

Features:

Account creation 

Limited vehicle registrations 

Limited notifications 

Basic dashboard 

Purchase QR tags 

Limitations:

Restricted monthly notifications 

No premium support 

No advanced analytics 

Limited referral rewards 



Premium Monthly Plan

Features:

Unlimited vehicle registrations 

Unlimited QR notifications 

Priority SMS and email delivery 

Premium customer support 

Referral bonus multiplier 

Dashboard analytics 

Notification history 

Vehicle management tools 

Billing:

Monthly recurring payment 



Premium Annual Plan

Features:

All Premium Monthly benefits 

Discounted annual pricing 

Annual invoice 

Auto-renewal option 



Lifetime Membership

Features:

One-time payment 

No recurring billing 

Permanent premium access 

Lifetime dashboard access 

Premium customer support 

Exclusive future features (subject to policy) 



Functional Requirements

FR-MEMBER-001

The system shall allow customers to purchase a membership plan.

Priority: Critical



FR-MEMBER-002

The system shall record:

Membership Type 

Start Date 

Expiration Date 

Status 

Payment ID 

Auto Renewal Status 



FR-MEMBER-003

The system shall automatically activate membership after successful payment confirmation.



FR-MEMBER-004

The system shall automatically expire memberships when the validity period ends unless renewed.



FR-MEMBER-005

The system shall notify customers before expiration.

Suggested schedule:

30 days before 

15 days before 

7 days before 

3 days before 

On expiration day 



Membership Status Values

Status

Description

Pending

Payment initiated

Active

Membership currently valid

Grace Period

Recently expired, limited access

Expired

Subscription ended

Suspended

Disabled by Admin

Cancelled

Cancelled by customer



11. Payment Module

Overview

The Payment Module manages all financial transactions, including:

Membership purchases 

QR Tag purchases 

Replacement tags 

Add-on services 

Promotional discounts 



Supported Payment Methods

Credit Card 

Debit Card 

Apple Pay 

Google Pay 

Stripe 

PayPal (Future) 

Bank Transfer (Admin Approval) 



Payment Workflow

Customer selects plan

        ↓

Checkout Page

        ↓

Payment Gateway

        ↓

Payment Verification

        ↓

Membership Activated

        ↓

Invoice Generated

        ↓

Email Confirmation



Functional Requirements

FR-PAY-001

The system shall securely redirect customers to the selected payment gateway.



FR-PAY-002

The system shall verify payment success using webhook callbacks before activating any purchased service.



FR-PAY-003

The system shall generate a unique transaction reference for every payment.



FR-PAY-004

The system shall generate downloadable invoices in PDF format.



FR-PAY-005

The system shall maintain a complete payment history.



Payment Status

Pending 

Authorized 

Paid 

Failed 

Refunded 

Cancelled 

Chargeback 



12. Referral & Rewards Module

Overview

The Referral Module encourages organic growth by rewarding users who successfully invite new customers to the platform.



Referral Workflow

User Registers

       ↓

Referral Code Generated

       ↓

User Shares Referral Link

       ↓

Friend Registers

       ↓

Friend Purchases Membership

       ↓

Referral Validated

       ↓

Reward Issued



Reward Types

Cash Credits 

Reward Points 

Membership Discount 

Free QR Tags 

Promotional Coupons 



Functional Requirements

FR-REF-001

Each registered user shall receive a unique referral code.



FR-REF-002

The system shall track referral registrations.



FR-REF-003

Rewards shall only be issued after the referred user completes a qualifying purchase.



FR-REF-004

The system shall prevent self-referrals and duplicate reward claims.



Referral Dashboard

Customers can view:

Referral Code 

Referral Link 

Total Invites 

Successful Referrals 

Pending Rewards 

Earned Rewards 

Reward History 



13. Customer Dashboard

Overview

The dashboard serves as the central hub for users to manage their account, vehicles, memberships, tags, notifications, and rewards.



Dashboard Widgets

Profile Summary

Displays:

Name 

Membership 

Active Since 

Last Login 



Vehicle Summary

Displays:

Total Vehicles 

Active Tags 

Inactive Tags 



Membership Summary

Displays:

Current Plan 

Renewal Date 

Remaining Days 



Notifications Summary

Displays:

Notifications Today 

This Month 

Total Received 



Referral Summary

Displays:

Total Referrals 

Rewards Earned 

Pending Rewards 



Quick Actions

Add Vehicle 

Activate Tag 

Buy Membership 

View Notifications 

Contact Support 



14. Notification Center

Overview

The Notification Center provides a complete history of all alerts received through QR scans.



Notification Categories

Headlights On 

Window Open 

Flat Tire 

Vehicle Damage 

Blocking Parking 

Emergency 

Tow Warning 

Other 



Notification Details

Each notification stores:

Notification ID 

Vehicle 

QR Tag 

Category 

Finder Message 

Date 

Delivery Status 

Read Status 



Functional Requirements

FR-NOTIFY-010

Customers shall be able to filter notifications by:

Vehicle 

Category 

Date 

Status 



FR-NOTIFY-011

Notifications shall be searchable using keywords.



FR-NOTIFY-012

Notifications shall remain archived according to the platform's data retention policy.



15. Customer Support Module

Features

Customers can:

Submit support tickets 

Track ticket status 

Upload attachments 

Reply to support staff 

Rate support experience 



Ticket Status

Open 

In Progress 

Waiting for Customer 

Resolved 

Closed 



Functional Requirements

FR-SUPPORT-001

Every support ticket shall receive a unique ticket number.



FR-SUPPORT-002

Customers shall receive email updates whenever the ticket status changes.



16. Content Management System (CMS)

The CMS allows administrators to update public-facing content without software deployments.



CMS Pages

Home 

About 

FAQ 

Privacy Policy 

Terms of Service 

Refund Policy 

Contact 

Pricing 

Blog (Future) 



Editable Content

Hero banners 

Images 

Slogans 

Buttons 

Testimonials 

Pricing tables 

Footer 

Social media links 



17. Administration Module

Overview

Administrators manage all aspects of the platform.



Dashboard

Displays:

Total Users 

Active Memberships 

Revenue 

QR Activations 

Notifications 

Support Tickets 

Referral Statistics 

System Health 



User Management

Functions:

Search Users 

Suspend Users 

Reset Password 

View Activity 

Manage Memberships 



Vehicle Management

Functions:

Search Vehicles 

Assign Tags 

Transfer Ownership 

Archive Vehicles 



QR Management

Functions:

Generate QR Tags 

Replace QR Tags 

Deactivate Tags 

Print QR Labels 



Membership Management

Functions:

Create Plans 

Modify Plans 

Cancel Memberships 

Issue Complimentary Memberships 



Payment Management

Functions:

View Transactions 

Process Refunds 

Export Financial Reports 



Support Management

Functions:

Assign Tickets 

Escalate Tickets 

Close Tickets 

SLA Monitoring 



18. Reporting & Analytics

The platform shall provide comprehensive reporting for business intelligence.



Standard Reports

User Growth 

Membership Sales 

Revenue 

QR Tag Sales 

Notification Activity 

Referral Performance 

Support Metrics 

Payment Failures 



Dashboard Charts

Daily Registrations 

Monthly Revenue 

Membership Distribution 

Notification Volume 

QR Activation Trends 



19. Role-Based Access Control (RBAC)

Roles

Role

Access

Visitor

Public Website

Customer

Personal Dashboard

Support Agent

Tickets & Customer Assistance

Finance

Payments & Refunds

Operations

QR & Vehicle Management

Administrator

Full System Access

Super Administrator

Platform Configuration & Security



Permission Examples

Permission

Customer

Support

Admin

View Own Profile

✔

✔

✔

Edit Own Profile

✔

✔

✔

View All Users

✖

✔

✔

Delete User

✖

✖

✔

Refund Payments

✖

✖

✔

System Settings

✖

✖

✔



20. Audit Logging

Every critical action shall generate an audit record.



Logged Events

Login 

Logout 

Password Change 

Membership Purchase 

Payment 

QR Activation 

Vehicle Registration 

Profile Updates 

Admin Actions 

Security Events 



Audit Fields

Audit ID 

User ID 

Action 

Module 

Timestamp (UTC) 

IP Address 

Device Information 

Previous Value 

New Value 



21. Business Rules

Examples:

A QR Tag can only be assigned to one active vehicle at a time. 

Each QR Tag must have a globally unique identifier. 

Personal contact information must never be displayed to a finder. 

Rewards are issued only after qualifying purchases. 

Membership benefits become active only after confirmed payment. 

Deleted vehicles with historical notifications must be archived rather than permanently removed. 

QR Tags reported as lost or stolen cannot be reactivated without administrator approval. 



22. Validation Rules

Examples:

Email addresses must be unique. 

Phone numbers must follow country-specific formats. 

License plate numbers must be validated according to regional rules where applicable. 

Passwords must meet the configured complexity requirements. 

Uploaded images must conform to permitted file types and size limits. 

Free-text notification messages shall be limited to a configurable maximum length and filtered for prohibited content. 



23. Error Handling Standards

The application shall:

Return standardized API error responses. 

Display user-friendly error messages. 

Log technical exceptions for administrators. 

Retry transient failures where appropriate. 

Avoid exposing sensitive system information in error messages. 

Example API response:

{

  "success": false,

  "errorCode": "PAYMENT_FAILED",

  "message": "The payment could not be completed. Please try again or use another payment method."

}



End of SRS – Part 2

This section completes the operational business modules, including memberships, payments, referrals, dashboards, administration, reporting, RBAC, audit logging, business rules, validation standards, and error handling.

Part 3 – Technical Architecture & Non-Functional Requirements

Version: 1.0



24. Technical Architecture Overview

Architecture Goals

The TRAFFTAG platform shall be designed to achieve:

High Availability 

Horizontal Scalability 

Security by Design 

Fault Tolerance 

Cloud Native Deployment 

API-First Architecture 

Modular Development 

Easy Maintenance 

The system will follow a Layered Clean Architecture with separation of concerns.



25. High-Level System Architecture

                        Internet

                            │

                ┌────────────────────┐

                │    Cloudflare CDN  │

                └─────────┬──────────┘

                          │

                ┌────────────────────┐

                │ AWS Load Balancer  │

                └─────────┬──────────┘

                          │

                 ASP.NET Core Web API

                          │

      ┌───────────────────┼──────────────────┐

      │                   │                  │

 Authentication      Business Logic     Notification Service

      │                   │                  │

      └──────────────┬────┴─────┬────────────┘

                     │          │

                  SQL Server    Redis Cache

                     │

        Blob Storage / Amazon S3



26. Recommended Technology Stack

Frontend

Component

Technology

Framework

React.js

Language

TypeScript

UI Library

Material UI / Tailwind CSS

State Management

Redux Toolkit

Routing

React Router

Forms

React Hook Form

Charts

ApexCharts



Backend

Component

Technology

Framework

ASP.NET Core 8 Web API

Language

C#

ORM

Entity Framework Core

Authentication

JWT + Refresh Token

Validation

FluentValidation

Logging

Serilog

API Documentation

Swagger/OpenAPI



Database

Component

Technology

Database

Microsoft SQL Server 2022

Cache

Redis

Full Text Search

SQL Server Full Text Search



Infrastructure

Component

Technology

Hosting

AWS

Storage

Amazon S3

CDN

CloudFront

SSL

AWS Certificate Manager

DNS

Route53

Monitoring

CloudWatch



27. Software Design Principles

The platform shall follow:

SOLID Principles 

DRY (Don't Repeat Yourself) 

KISS (Keep It Simple) 

Repository Pattern 

Dependency Injection 

Clean Architecture 

CQRS (optional for scalability) 

Unit of Work Pattern 



28. Application Layers

Presentation Layer

Responsibilities:

React UI 

Forms 

Validation 

User Experience 

API Consumption 



API Layer

Responsibilities:

Authentication 

Authorization 

Request Validation 

Response Formatting 

Exception Handling 



Business Layer

Responsibilities:

Business Rules 

Membership Logic 

QR Logic 

Notification Rules 

Referral Calculations 



Data Layer

Responsibilities:

Database Access 

Repository Implementation 

Stored Procedures (where appropriate) 

Transactions 



Infrastructure Layer

Responsibilities:

Email 

SMS 

Payments 

Logging 

File Storage 

Cache 



29. Authentication Architecture

Supported authentication methods:

Email & Password 

Google OAuth (Future) 

Apple Sign-In (Future) 

Microsoft Login (Future) 



Authentication Flow

User Login

     │

Credential Validation

     │

Generate JWT

     │

Generate Refresh Token

     │

Store Refresh Token

     │

Return Access Token



JWT Claims

UserId 

Email 

Role 

MembershipType 

TokenVersion 

Expiration 



30. Authorization Model (RBAC)

The platform shall use Role-Based Access Control.

Roles include:

Visitor 

Customer 

Fleet Manager 

Support Agent 

Finance 

Marketing 

Administrator 

Super Administrator 

Each API endpoint shall validate:

Authentication 

Role 

Permission 

Resource Ownership (where applicable) 



31. API Standards

RESTful Design

Examples:

GET    /api/v1/vehicles

POST   /api/v1/vehicles

PUT    /api/v1/vehicles/{id}

DELETE /api/v1/vehicles/{id}



Standard Response

Successful response:

{

    "success": true,

    "message": "Vehicle created successfully.",

    "data": {}

}



Error response:

{

    "success": false,

    "errorCode": "VALIDATION_ERROR",

    "message": "The request contains invalid data.",

    "errors": []

}



32. API Versioning Strategy

Supported versions:

v1 

v2 

Future versions 

Versioning approach:

/api/v1/

Older versions will remain supported for a defined deprecation period.



33. API Security

Security controls include:

JWT Authentication 

HTTPS Only 

Rate Limiting 

IP Throttling 

Request Size Limits 

CORS Policy 

Input Sanitization 

SQL Injection Protection 

XSS Protection 

CSRF Protection (where applicable) 

API Key support for partner integrations 



34. Notification Architecture

Notification channels:

Email 

SMS 

Push Notifications 

Future Mobile App Notifications 



Delivery Flow

QR Scan

     │

Notification Created

     │

Notification Queue

     │

Worker Service

     │

Email

SMS

Push

Queue-based processing ensures reliable delivery and prevents blocking user requests.



35. Third-Party Integrations

Stripe

Purpose:

Membership payments 

Tag purchases 

Refunds 



Twilio

Purpose:

SMS notifications 

OTP delivery 



SendGrid

Purpose:

Email notifications 

Membership reminders 

Password reset emails 



Firebase Cloud Messaging

Purpose:

Mobile push notifications 

Future app support 



Google Maps API (Future)

Purpose:

Fleet services 

Vehicle location references (if introduced) 



36. QR Code Lifecycle

Manufactured

      │

Generated

      │

Assigned

      │

Purchased

      │

Activated

      │

In Use

      │

Transferred (Optional)

      │

Replaced (Optional)

      │

Archived

A tag may only have one active assignment at a time.



37. Notification Lifecycle

QR Scanned

      │

Form Submitted

      │

Validation

      │

Notification Created

      │

Queued

      │

Delivered

      │

Read

      │

Archived

Failed deliveries shall be retried according to configurable retry policies.



38. Database Standards

Naming Convention

Tables:

Users

Vehicles

Memberships

Notifications

Primary Keys:

UserId

VehicleId

MembershipId

Foreign Keys:

FK_Vehicle_User

FK_Tag_Vehicle

Indexes:

IX_User_Email

IX_Tag_SerialNumber



39. Data Retention Policy

Data

Retention

Users

Until account deletion request and legal obligations are met

Notifications

5 Years

Audit Logs

7 Years

Payments

7 Years

QR Scans

2 Years

Support Tickets

5 Years

Retention periods should be configurable to comply with local regulations.



40. Backup & Disaster Recovery

Database Backups

Daily Full Backup 

Hourly Differential Backup 

Transaction Log Backup every 15 minutes 



Disaster Recovery

Recovery Time Objective (RTO): ≤ 4 Hours

Recovery Point Objective (RPO): ≤ 15 Minutes

Backups shall be encrypted and stored in geographically separate locations.



41. Monitoring & Logging

Application Monitoring

API Response Time 

CPU Usage 

Memory Usage 

Database Performance 

Queue Length 

Error Rate 

Active Users 



Logging Levels

Information 

Warning 

Error 

Critical 

Audit 

Logs shall include correlation IDs to trace requests across services.



42. Performance Requirements

Metric

Target

Home Page Load

≤ 2 seconds

Dashboard Load

≤ 3 seconds

API Response (95th percentile)

≤ 500 ms

Login

≤ 2 seconds

QR Notification Submission

≤ 3 seconds

Payment Processing

≤ 10 seconds

Concurrent Users

10,000+

Concurrent QR Scans

2,000+



43. Scalability Requirements

The platform shall support:

100,000+ registered users 

500,000+ vehicles 

1,000,000+ QR tags 

50 million notifications 

Horizontal scaling of application servers 

Read replicas for database reporting 

Distributed caching using Redis 



44. Availability Requirements

Target availability:

99.9% uptime 

Maintenance windows:

Scheduled during low-traffic periods 

Advance customer notification required 



45. Accessibility Requirements

The web application should conform to WCAG 2.1 AA where practical.

Requirements include:

Keyboard navigation 

Screen reader compatibility 

Sufficient color contrast 

Accessible form labels 

Error messages associated with fields 



46. Compliance Requirements

The platform should support compliance with:

GDPR (General Data Protection Regulation) 

CCPA (California Consumer Privacy Act), if applicable 

PCI DSS (Payment Card Industry Data Security Standard) for payment handling 

Local consumer protection and privacy regulations in deployment regions 

Compliance obligations will vary based on the countries in which TRAFFTAG operates.



47. Release Acceptance Criteria

A release is considered production-ready when:

All Critical and High severity defects are resolved. 

Functional and regression testing pass. 

Performance testing meets defined thresholds. 

Security testing identifies no unresolved critical vulnerabilities. 

Backup and recovery procedures are validated. 

Deployment scripts are tested in staging. 

Documentation is updated. 

Product Owner provides formal approval. 



48. Future Technical Enhancements

Potential future enhancements include:

Native iOS and Android applications 

Progressive Web App (PWA) 

GraphQL API 

AI-assisted notification categorization 

Multi-region deployment 

Event-driven architecture using message brokers (e.g., RabbitMQ or Azure Service Bus) 

IoT and NFC tag support 

Partner API ecosystem 



End of SRS – Part 3

This part establishes the technical foundation of the TRAFFTAG platform, covering architecture, technology stack, security, integrations, scalability, operations, compliance, and release readiness.

Part 4 – Database Design & Data Dictionary

Version: 1.0



Table of Contents

Database Overview 

Database Standards 

Naming Conventions 

Data Types 

Audit Standards 

Entity Relationship Overview 

Core Modules 

Master Tables 

Transaction Tables 

Security Tables 

Reporting Tables 

Data Dictionary 

Index Strategy 

Backup Strategy 

Archival Strategy 



1. Database Overview

Database Engine

Microsoft SQL Server 2022 Enterprise



Design Principles

The database shall be designed according to the following principles:

Third Normal Form (3NF) for transactional data 

Controlled denormalization only where justified for reporting/performance 

Soft delete for business entities 

Full auditability 

Foreign key integrity 

Optimized indexing 

Support for horizontal growth through partitioning if required 

UTC timestamps for all system-generated dates 



2. Database Architecture

The platform follows a relational model.

Users

 │

 ├──── Vehicles

 │        │

 │        ├──── QR Tags

 │        │

 │        └──── Notifications

 │

 ├──── Memberships

 │

 ├──── Payments

 │

 ├──── Referral Rewards

 │

 └──── Support Tickets



3. Database Naming Standards

Tables

Use singular PascalCase.

Examples:

User

Vehicle

QrTag

Membership

Notification

Payment



Primary Keys

Format:

<TableName>Id

Example:

UserId

VehicleId

NotificationId



Foreign Keys

Example

UserId

VehicleId

MembershipId



Index Names

IX_User_Email



IX_QrTag_SerialNumber



IX_Notification_CreatedOn



Constraint Names

PK_User



FK_Vehicle_User



FK_QrTag_Vehicle



CK_User_Email



UQ_QrTag_SerialNumber



4. Standard Audit Columns

Every transactional table shall contain the following audit fields.

Column

Data Type

Description

CreatedBy

BIGINT NULL

User who created the record

CreatedOn

DATETIME2

UTC creation timestamp

ModifiedBy

BIGINT NULL

Last modifying user

ModifiedOn

DATETIME2 NULL

Last modification timestamp

IsDeleted

BIT

Soft delete flag

DeletedBy

BIGINT NULL

User who deleted the record

DeletedOn

DATETIME2 NULL

Soft delete timestamp



5. Common Lookup Tables

To support flexibility and localization, the following lookup tables are recommended:

Table

Purpose

Country

Countries

State

States / Provinces

City

Cities

VehicleMake

Vehicle manufacturers

VehicleModel

Vehicle models

MembershipPlan

Subscription plans

NotificationCategory

Alert categories

PaymentMethod

Payment methods

PaymentStatus

Payment status values

TicketStatus

Support ticket statuses

UserRole

System roles

Permission

System permissions



6. Entity Relationship Overview (Logical)

User

 │

 ├── Vehicle

 │      │

 │      ├── VehicleTag

 │      │

 │      ├── Notification

 │      │

 │      └── VehicleImage

 │

 ├── Membership

 │

 ├── Payment

 │

 ├── Referral

 │

 ├── RewardTransaction

 │

 ├── LoginHistory

 │

 └── SupportTicket



7. Core Entity List

Security

User 

Role 

Permission 

UserRole 

RolePermission 

LoginHistory 

AuditLog 

RefreshToken 



Customer

CustomerProfile 

Address 

EmergencyContact 



Vehicle

Vehicle 

VehicleImage 

VehicleDocument 

VehicleOwnershipHistory 



QR Module

QrTag 

QrTagAssignment 

QrScanHistory 

TagReplacementHistory 



Notification

Notification 

NotificationAttachment 

NotificationDelivery 

NotificationReadHistory 



Membership

MembershipPlan 

Membership 

MembershipBenefit 

MembershipRenewal 



Payment

Payment 

PaymentTransaction 

Refund 

Invoice 



Referral

Referral 

ReferralReward 

RewardTransaction 



Support

SupportTicket 

SupportMessage 

SupportAttachment 



Administration

SystemSetting 

CMSPage 

Banner 

FAQ 



8. Database Relationships

User → Vehicle

One User

↓

Many Vehicles

User (1)



Vehicle (Many)



Vehicle → QR Tag

One Vehicle

↓

One Active QR Tag

Historical assignments stored separately.

Vehicle (1)



QrTagAssignment (Many)



QrTag (1)



Vehicle → Notification

One Vehicle

↓

Many Notifications



Membership → Payment

One Membership

↓

Many Payments



User → Referral

One User

↓

Many Referral Records



User → Support Ticket

One User

↓

Many Support Tickets



9. Master Data vs Transaction Data

Master Tables

Generally static or slowly changing.

Examples:

Country 

State 

City 

MembershipPlan 

UserRole 

Permission 

NotificationCategory 

PaymentMethod 



Transaction Tables

Continuously growing.

Examples:

Payment 

Notification 

LoginHistory 

AuditLog 

ReferralReward 

SupportTicket 



10. Data Type Standards

Data

SQL Server Type

Primary Key

BIGINT IDENTITY

Name

NVARCHAR(150)

Description

NVARCHAR(MAX)

Email

NVARCHAR(255)

Phone

NVARCHAR(25)

URL

NVARCHAR(500)

Boolean

BIT

Money

DECIMAL(18,2)

GPS Coordinates

DECIMAL(10,7)

QR Serial

NVARCHAR(100)

GUID

UNIQUEIDENTIFIER

Date

DATE

DateTime

DATETIME2

JSON Payload

NVARCHAR(MAX)



11. Soft Delete Policy

The platform shall never permanently delete operational business records by default.

Instead:

IsDeleted = 1



DeletedBy



DeletedOn

Administrators may purge archived records only through controlled maintenance procedures, subject to retention policies and legal requirements.



12. Index Strategy

Indexes shall support common search operations while balancing write performance.

Unique Indexes

Email



QR Serial Number



Membership Number



Invoice Number



Referral Code



Composite Indexes

(UserId, IsDeleted)



(VehicleId, Status)



(NotificationDate, VehicleId)



(PaymentDate, PaymentStatus)



Full-Text Search

Enable Full-Text Search on:

Support Messages 

Notification Messages 

CMS Content 

FAQ Content 



13. Backup Strategy

Full Backup

Daily at 02:00 UTC



Differential Backup

Every hour



Transaction Log Backup

Every 15 minutes



Backup Retention

Backup Type

Retention

Full

30 Days

Differential

14 Days

Transaction Log

7 Days

Monthly Archive

12 Months



14. Archival Strategy

Operational data older than the defined retention period should be archived to dedicated archive tables or storage.

Suggested archival thresholds:

Table

Archive After

Notification

24 Months

LoginHistory

12 Months

AuditLog

36 Months

Payment

84 Months

SupportTicket

60 Months



15. Data Dictionary Introduction

The following sections (Part 4A onward) will define every database table in detail, including:

Business purpose 

Columns 

Data types 

Constraints 

Primary and foreign keys 

Unique constraints 

Default values 

Indexes 

Relationships 

Validation rules 

Sample records 

Notes for Entity Framework Core mapping 

Part 4A – Core Security & Identity Database Design



Module Overview

The Security & Identity module is responsible for:

User Authentication 

Authorization 

Role Management 

Permission Management 

Login History 

Refresh Tokens 

Audit Logs 

Security Monitoring 

This module forms the foundation of the application. All other modules depend on it.



Entity Relationship Diagram (Security Module)

                 Role

                  │

                  │

          RolePermission

                  │

                  │

Permission ───────┘



                  │

                  │

User ─────────── UserRole

 │

 ├──────── RefreshToken

 │

 ├──────── LoginHistory

 │

 └──────── AuditLog



Table 1 – User

Purpose

Stores all registered users of the TRAFFTAG platform.

A user may own multiple vehicles, memberships, payments, referrals, and support tickets.



Table Name

User



Columns

Column

Data Type

Required

Description

UserId

BIGINT IDENTITY

Yes

Primary Key

FirstName

NVARCHAR(100)

Yes

First name

LastName

NVARCHAR(100)

Yes

Last name

Email

NVARCHAR(255)

Yes

Unique email

PasswordHash

NVARCHAR(500)

Yes

Encrypted password

PhoneNumber

NVARCHAR(30)

Yes

Mobile number

CountryCode

NVARCHAR(10)

Yes

+1, +91 etc

ProfileImage

NVARCHAR(500)

No

Image URL

EmailVerified

BIT

Yes

Email verified

PhoneVerified

BIT

Yes

Phone verified

IsActive

BIT

Yes

Active account

IsLocked

BIT

Yes

Locked account

FailedLoginCount

INT

Yes

Failed attempts

LastLogin

DATETIME2

No

Last login

CreatedOn

DATETIME2

Yes

UTC

CreatedBy

BIGINT

No

Audit

ModifiedOn

DATETIME2

No

Audit

ModifiedBy

BIGINT

No

Audit

IsDeleted

BIT

Yes

Soft Delete

DeletedOn

DATETIME2

No

Soft Delete

DeletedBy

BIGINT

No

Soft Delete



Business Rules

Email must be unique.

Phone number must be unique.

Password is never stored in plain text.

Deleted users cannot login.

Locked users cannot login.



Constraints

Primary Key

PK_User

Unique

Email



PhoneNumber



Indexes

IX_User_Email



IX_User_PhoneNumber



IX_User_IsActive



IX_User_LastLogin



Relationships

User



↓



Vehicles



Memberships



Payments



Notifications



SupportTickets



AuditLogs



Table 2 – Role

Purpose

Defines every system role.

Examples:

Customer

Support

Finance

Administrator

Super Administrator



Table

Role



Columns

Column

Type

RoleId

BIGINT IDENTITY

Name

NVARCHAR(100)

Description

NVARCHAR(500)

IsSystem

BIT

IsActive

BIT

CreatedOn

DATETIME2



Sample Data

Role

Customer

Fleet Manager

Support Agent

Finance

Administrator

Super Administrator



Constraints

Unique

Role Name



Table 3 – Permission

Purpose

Stores every permission available in the platform.



Examples

ViewUsers



EditUsers



DeleteUsers



CreateVehicle



DeleteVehicle



ApproveRefund



ViewReports



ManageCMS



Columns

Column

Type

PermissionId

BIGINT

Name

NVARCHAR(150)

Module

NVARCHAR(100)

Description

NVARCHAR(500)



Example Modules

Authentication

Vehicles

Payments

CMS

Reports

Support

Membership

Settings



Table 4 – RolePermission

Purpose

Many-to-many relationship between Roles and Permissions.



Columns

Column

Type

RolePermissionId

BIGINT

RoleId

BIGINT

PermissionId

BIGINT



Example

Administrator

↓

All Permissions



Support

↓

Tickets Only



Finance

↓

Payments Only



Table 5 – UserRole

Purpose

Assigns one or more roles to users.



Columns

Column

Type

UserRoleId

BIGINT

UserId

BIGINT

RoleId

BIGINT

AssignedOn

DATETIME2

AssignedBy

BIGINT



Business Rules

A user may have multiple roles if enabled by business policy.

Every user must have at least one role.



Table 6 – RefreshToken

Purpose

Stores active refresh tokens.

Supports:

JWT Authentication

Remember Me

Multiple Devices



Columns

Column

Type

RefreshTokenId

BIGINT

UserId

BIGINT

Token

NVARCHAR(MAX)

DeviceName

NVARCHAR(200)

DeviceType

NVARCHAR(100)

Browser

NVARCHAR(200)

IPAddress

NVARCHAR(50)

ExpirationDate

DATETIME2

IsRevoked

BIT



Business Rules

Expired tokens cannot be reused.

Revoked tokens are immediately invalid.

Password changes revoke all active refresh tokens.



Table 7 – LoginHistory

Purpose

Stores every login attempt.

Useful for:

Security

Reporting

Fraud Detection

Compliance



Columns

Column

Type

LoginHistoryId

BIGINT

UserId

BIGINT

LoginTime

DATETIME2

LogoutTime

DATETIME2

IPAddress

NVARCHAR(50)

Browser

NVARCHAR(200)

Device

NVARCHAR(200)

OperatingSystem

NVARCHAR(150)

LoginStatus

NVARCHAR(50)

FailureReason

NVARCHAR(500)



Example Status

Success



Invalid Password



Locked Account



Expired Token



Unknown User



Disabled Account



Indexes

IX_Login_User



IX_Login_Time



IX_Login_Status



Table 8 – AuditLog

Purpose

Stores every critical system action.

This table is extremely important.

It helps:

Compliance

Investigations

Security

Support



Columns

Column

Type

AuditLogId

BIGINT

UserId

BIGINT

Module

NVARCHAR(100)

Action

NVARCHAR(100)

EntityName

NVARCHAR(150)

EntityId

BIGINT

OldValues

NVARCHAR(MAX)

NewValues

NVARCHAR(MAX)

IPAddress

NVARCHAR(50)

Browser

NVARCHAR(200)

Timestamp

DATETIME2



Example Actions

Login



Logout



Vehicle Added



Vehicle Deleted



Membership Purchased



Payment Completed



Role Updated



Password Changed



QR Activated



Notification Sent



Business Rules

Audit records cannot be edited.

Audit records cannot be deleted through the application.

Only Super Administrators may view sensitive audit information.



Security Considerations

The identity subsystem shall implement the following safeguards:

Passwords stored using a modern adaptive hashing algorithm (e.g., Argon2id or bcrypt) with unique salts. 

Multi-factor authentication (MFA) support for privileged accounts. 

Account lockout after repeated failed login attempts. 

Secure, HttpOnly, and SameSite cookies if cookies are used for refresh tokens. 

JWT access tokens with short expiration times. 

Refresh token rotation and revocation. 

IP-based and user-based rate limiting on authentication endpoints. 

Comprehensive audit logging for security-sensitive events. 



Module Relationships

User

 │

 ├──────── UserRole

 │            │

 │            └──────── Role

 │                         │

 │                         └──────── RolePermission

 │                                      │

 │                                      └──────── Permission

 │

 ├──────── LoginHistory

 │

 ├──────── RefreshToken

 │

 └──────── AuditLog



Data Volume Estimates

Table

Estimated Growth

User

1 million+

Role

< 20

Permission

200–500

UserRole

2–5 million

RefreshToken

10–20 million

LoginHistory

100+ million

AuditLog

500+ million

Recommendation: Partition large tables such as LoginHistory and AuditLog by date to improve maintenance and query performance as the platform scales.



End of Part 4A

This section defines the core identity and security data model that every other module will build upon.

Part 4B – Customer & Vehicle Database Design

Version: 1.0



Module Overview

This module manages:

Customer Profiles 

Addresses 

Emergency Contacts 

Vehicles 

Vehicle Images 

Vehicle Documents 

Ownership History 

Fleet Support 

Vehicle Preferences 



Module ER Diagram

                    User

                      │

         ┌────────────┼────────────┐

         │            │            │

         ▼            ▼            ▼

 CustomerProfile   Address   EmergencyContact

         │

         ▼

      Vehicle

         │

 ┌───────┼──────────────┬──────────────┐

 ▼       ▼              ▼              ▼

VehicleImage VehicleDocument VehicleOwnership VehiclePreference



Table 1 – CustomerProfile

Purpose

Stores additional information about a user beyond authentication details.



Table Name

CustomerProfile



Columns

Column

Data Type

Required

Description

CustomerProfileId

BIGINT IDENTITY

Yes

Primary Key

UserId

BIGINT

Yes

FK → User

DateOfBirth

DATE

No

Customer DOB

Gender

NVARCHAR(20)

No

Gender

Occupation

NVARCHAR(150)

No

Occupation

PreferredLanguage

NVARCHAR(20)

Yes

Language preference

TimeZone

NVARCHAR(100)

Yes

User timezone

MarketingConsent

BIT

Yes

Marketing emails/SMS

ProfileCompletion

DECIMAL(5,2)

Yes

Completion %

CreatedOn

DATETIME2

Yes

UTC

ModifiedOn

DATETIME2

No

UTC



Business Rules

One CustomerProfile per User. 

Language defaults to English. 

Profile completion updates automatically. 



Relationships

User (1)

      │

      ▼

CustomerProfile (1)



Table 2 – Address

Purpose

Stores customer addresses for shipping and billing.



Table

Address



Columns

Column

Type

AddressId

BIGINT

UserId

BIGINT

AddressType

NVARCHAR(30)

FullName

NVARCHAR(200)

Company

NVARCHAR(200)

AddressLine1

NVARCHAR(300)

AddressLine2

NVARCHAR(300)

City

NVARCHAR(100)

State

NVARCHAR(100)

Country

NVARCHAR(100)

PostalCode

NVARCHAR(20)

Latitude

DECIMAL(10,7)

Longitude

DECIMAL(10,7)

IsDefault

BIT



Address Types

Home 

Office 

Shipping 

Billing 

Fleet Location 



Rules

A customer may store multiple addresses.

Only one default shipping address is allowed.

Only one default billing address is allowed.



Table 3 – EmergencyContact

Purpose

Stores emergency contact details.



Columns

Column

Type

EmergencyContactId

BIGINT

UserId

BIGINT

ContactName

NVARCHAR(150)

Relationship

NVARCHAR(100)

Phone

NVARCHAR(30)

Email

NVARCHAR(255)



Notes

Optional feature.

Useful for premium memberships.



Table 4 – Vehicle

Purpose

Stores every registered vehicle.

This is one of the most important tables.



Table

Vehicle



Columns

Column

Type

VehicleId

BIGINT

UserId

BIGINT

MakeId

BIGINT

ModelId

BIGINT

Year

SMALLINT

VIN

NVARCHAR(50)

LicensePlate

NVARCHAR(50)

RegistrationState

NVARCHAR(100)

Color

NVARCHAR(50)

NickName

NVARCHAR(100)

VehicleType

NVARCHAR(50)

FuelType

NVARCHAR(50)

RegistrationExpiry

DATE

InsuranceExpiry

DATE

Status

NVARCHAR(30)



Vehicle Types

Car 

SUV 

Truck 

Van 

Motorcycle 

Trailer 

Commercial Vehicle 



Status

Active 

Sold 

Archived 

Stolen 

Scrapped 



Business Rules

VIN must be unique when provided.

A vehicle may have only one active QR tag.

A user may own multiple vehicles.

Deleted vehicles are archived.



Relationships

User



↓



Vehicle



↓



QR Tag



↓



Notifications



Indexes

IX_Vehicle_User



IX_Vehicle_VIN



IX_Vehicle_LicensePlate



IX_Vehicle_Status



Table 5 – VehicleImage

Purpose

Stores images uploaded for vehicles.



Columns

Column

Type

VehicleImageId

BIGINT

VehicleId

BIGINT

ImageURL

NVARCHAR(500)

ThumbnailURL

NVARCHAR(500)

ImageType

NVARCHAR(50)

SortOrder

INT



Image Types

Front

Rear

Left

Right

Interior

Damage

Registration

Insurance



Table 6 – VehicleDocument

Purpose

Stores supporting documents.



Supported Documents

Registration Certificate

Insurance Certificate

Inspection Report

Purchase Invoice

Ownership Certificate



Columns

Column

Type

VehicleDocumentId

BIGINT

VehicleId

BIGINT

DocumentType

NVARCHAR(100)

FileURL

NVARCHAR(500)

ExpirationDate

DATE

Verified

BIT



Table 7 – VehicleOwnershipHistory

Purpose

Tracks historical ownership changes.



Columns

Column

Type

OwnershipHistoryId

BIGINT

VehicleId

BIGINT

PreviousOwnerId

BIGINT

NewOwnerId

BIGINT

TransferDate

DATETIME2

TransferReason

NVARCHAR(200)



Transfer Reasons

Sale

Gift

Fleet Transfer

Dealer

Inheritance



Table 8 – VehiclePreference

Purpose

Stores customer-specific preferences.



Columns

Column

Type

PreferenceId

BIGINT

VehicleId

BIGINT

ReceiveSMS

BIT

ReceiveEmail

BIT

ReceivePush

BIT

SilentHoursStart

TIME

SilentHoursEnd

TIME

Language

NVARCHAR(20)



Example

Receive SMS ✔

Receive Email ✔

Push ✔

Silent Hours

10 PM – 6 AM



Table 9 – Garage (Fleet)

Purpose

Supports business customers managing fleets.



Columns

Column

Type

GarageId

BIGINT

UserId

BIGINT

Name

NVARCHAR(200)

Description

NVARCHAR(500)

AddressId

BIGINT



Business Rules

One customer may own multiple garages.

Each garage manages multiple vehicles.



Table 10 – DriverAssignment

Purpose

Allows fleet owners to assign drivers to vehicles.



Columns

Column

Type

DriverAssignmentId

BIGINT

VehicleId

BIGINT

DriverName

NVARCHAR(200)

DriverPhone

NVARCHAR(30)

StartDate

DATE

EndDate

DATE

Active

BIT



Vehicle Lifecycle

Vehicle Created

      │

      ▼

Vehicle Registered

      │

      ▼

QR Assigned

      │

      ▼

Membership Active

      │

      ▼

Notifications Received

      │

      ▼

Ownership Transfer (Optional)

      │

      ▼

Archived



Validation Rules

Vehicle

License Plate is required. 

Vehicle Year must not exceed the current calendar year plus one. 

VIN, when supplied, must contain 17 characters. 

Registration expiry cannot precede the registration issue date. 

Insurance expiry cannot precede the insurance issue date. 

Vehicle nickname must be unique per user. 



Images

Supported formats: JPG, JPEG, PNG, WEBP. 

Maximum upload size: 10 MB (configurable). 

Recommended resolution: 1920 × 1080 or higher. 

Malware scanning should be performed before storage. 



Documents

PDF, JPG, PNG accepted. 

Maximum size: 20 MB. 

Version history should be maintained when replacing documents. 



Recommended Indexes

Index

Purpose

IX_Vehicle_UserId

Retrieve vehicles by owner

IX_Vehicle_LicensePlate

Fast plate lookup

IX_Vehicle_VIN

Unique VIN lookup

IX_Address_UserId

Address retrieval

IX_Garage_UserId

Fleet management

IX_DriverAssignment_VehicleId

Driver lookup



Estimated Scale

Table

Estimated Rows (5 Years)

Vehicle

2,000,000+

VehicleImage

8,000,000+

VehicleDocument

6,000,000+

Address

3,000,000+

CustomerProfile

1,000,000+

DriverAssignment

10,000,000+



Business Rules Summary

Every vehicle must belong to one registered user. 

A vehicle can have only one active QR tag at any given time. 

Ownership transfers must preserve historical records. 

Vehicle images and documents are never permanently deleted through the application; they are archived according to retention policies. 

Fleet management features are available only to authorized business or fleet accounts. 

Notification preferences are configurable per vehicle, allowing owners to customize communication channels. 



End of Part 4B

The Customer & Vehicle module establishes the ownership model for the platform. Every QR tag, notification, membership entitlement, and audit trail ultimately references a registered vehicle and its associated owner.

Part 4C – QR Tag & Notification Module Database Design

Version: 1.0



Module Overview

This module is responsible for the complete lifecycle of QR tags and notifications, including:

QR Tag Manufacturing 

QR Inventory 

Tag Assignment 

Tag Activation 

QR Scanning 

Anonymous Notification Submission 

Multi-channel Notification Delivery 

Delivery Tracking 

Read Tracking 

Tag Replacement 

Abuse Reporting 

This module forms the operational heart of the TRAFFTAG platform.



Module ER Diagram

                 Vehicle

                     │

                     ▼

                QrTagAssignment

                     │

                     ▼

                  QrTag

                /      \

               ▼        ▼

      QrScanHistory   TagReplacementHistory

               │

               ▼

         Notification

         /     |      \

        ▼      ▼       ▼

NotificationAttachment

NotificationDelivery

NotificationReadHistory



Table 1 – QrTag

Purpose

Stores every QR tag manufactured or generated by TRAFFTAG. Each tag has a globally unique identity and progresses through a defined lifecycle.



Table Name

QrTag



Columns

Column

Type

Description

QrTagId

BIGINT IDENTITY

Primary Key

SerialNumber

NVARCHAR(100)

Unique printed serial

UniqueCode

UNIQUEIDENTIFIER

Internal unique identifier

QRValue

NVARCHAR(500)

Encoded QR payload

BatchNumber

NVARCHAR(100)

Manufacturing batch

ManufactureDate

DATETIME2

Production date

ActivationCode

NVARCHAR(50)

Optional activation code

Status

NVARCHAR(30)

Current status

IsPremiumTag

BIT

Premium edition

CreatedOn

DATETIME2

UTC

ModifiedOn

DATETIME2

UTC



Tag Status

Manufactured 

In Inventory 

Sold 

Assigned 

Activated 

Suspended 

Lost 

Stolen 

Replaced 

Archived 



Business Rules

SerialNumber must be globally unique. 

QRValue must be cryptographically unpredictable. 

A QR tag can have only one active assignment. 

Archived tags cannot be reactivated. 



Indexes

UQ_QrTag_SerialNumber 

UQ_QrTag_UniqueCode 

IX_QrTag_Status 

IX_QrTag_BatchNumber 



Table 2 – QrTagAssignment

Purpose

Maintains the relationship between a QR tag and a vehicle. Historical assignments are preserved for audit purposes.



Columns

Column

Type

AssignmentId

BIGINT

QrTagId

BIGINT

VehicleId

BIGINT

AssignedDate

DATETIME2

ActivatedDate

DATETIME2

DeactivatedDate

DATETIME2

AssignmentStatus

NVARCHAR(30)

AssignedBy

BIGINT



Assignment Status

Pending 

Active 

Inactive 

Transferred 

Replaced 

Cancelled 



Rules

Only one active assignment per QR tag. 

Only one active QR tag per vehicle. 

Assignment history is immutable. 



Table 3 – QrScanHistory

Purpose

Captures every scan event for analytics, troubleshooting, and abuse detection.



Columns

Column

Type

ScanHistoryId

BIGINT

QrTagId

BIGINT

ScanTime

DATETIME2

IPAddress

NVARCHAR(50)

Browser

NVARCHAR(200)

DeviceType

NVARCHAR(100)

OperatingSystem

NVARCHAR(100)

Country

NVARCHAR(100)

State

NVARCHAR(100)

City

NVARCHAR(100)

Latitude

DECIMAL(10,7) NULL

Longitude

DECIMAL(10,7) NULL

ScanResult

NVARCHAR(50)

UserAgent

NVARCHAR(MAX)



Scan Result

Success 

Invalid Tag 

Expired Tag 

Suspended Tag 

Rate Limited 

Blocked 



Security Rules

Record approximate location only when permission is granted by the scanning device. 

Never expose scanner identity to the vehicle owner. 

Log excessive scans for abuse detection. 



Table 4 – Notification

Purpose

Represents the message created by a finder after scanning a QR tag.



Columns

Column

Type

NotificationId

BIGINT

QrTagId

BIGINT

VehicleId

BIGINT

NotificationCategoryId

BIGINT

FinderMessage

NVARCHAR(1000)

FinderPhone

NVARCHAR(30) NULL

Priority

NVARCHAR(20)

Status

NVARCHAR(30)

CreatedOn

DATETIME2

ExpirationDate

DATETIME2 NULL



Priority

Low 

Normal 

High 

Emergency 



Status

Pending 

Validated 

Queued 

Delivered 

Failed 

Expired 

Archived 



Business Rules

Owner contact details are never stored with the notification presented to the finder. 

Message length is configurable (default 1,000 characters). 

CAPTCHA and rate limiting are required before notification creation. 



Table 5 – NotificationAttachment

Purpose

Allows optional images or files to accompany a notification (e.g., a photo of vehicle damage).



Columns

Column

Type

AttachmentId

BIGINT

NotificationId

BIGINT

FileName

NVARCHAR(255)

FileUrl

NVARCHAR(500)

MimeType

NVARCHAR(100)

FileSize

BIGINT

UploadedOn

DATETIME2



Supported File Types

JPG 

PNG 

WEBP 

PDF (optional, configurable) 



Rules

Files are virus scanned before becoming available. 

Maximum file size is configurable (recommended default: 10 MB). 



Table 6 – NotificationDelivery

Purpose

Tracks delivery attempts across all communication channels.



Columns

Column

Type

DeliveryId

BIGINT

NotificationId

BIGINT

Channel

NVARCHAR(30)

Recipient

NVARCHAR(255)

DeliveryStatus

NVARCHAR(30)

AttemptCount

INT

ProviderMessageId

NVARCHAR(200)

DeliveredOn

DATETIME2 NULL

FailureReason

NVARCHAR(500) NULL



Channels

Email 

SMS 

Push Notification 

In-App Notification 



Delivery Status

Pending 

Queued 

Sent 

Delivered 

Failed 

Retrying 

Cancelled 



Retry Policy

Attempt 1: Immediate 

Attempt 2: After 5 minutes 

Attempt 3: After 30 minutes 

Attempt 4: After 2 hours 

Final failure logged for review 



Table 7 – NotificationReadHistory

Purpose

Tracks when the vehicle owner views a notification.



Columns

Column

Type

ReadHistoryId

BIGINT

NotificationId

BIGINT

UserId

BIGINT

ReadOn

DATETIME2

DeviceType

NVARCHAR(100)

Browser

NVARCHAR(200)



Rules

First read timestamp is preserved. 

Subsequent reads may be logged separately for analytics. 



Table 8 – NotificationTemplate

Purpose

Stores reusable templates for system-generated notifications.



Columns

Column

Type

TemplateId

BIGINT

Name

NVARCHAR(100)

Channel

NVARCHAR(30)

Subject

NVARCHAR(255)

Body

NVARCHAR(MAX)

Language

NVARCHAR(20)

IsActive

BIT



Example Templates

Welcome Email 

Password Reset 

Membership Renewal Reminder 

QR Tag Activated 

Notification Received 

Payment Successful 



Table 9 – TagReplacementHistory

Purpose

Maintains an immutable history of QR tag replacements.



Columns

Column

Type

ReplacementId

BIGINT

OldQrTagId

BIGINT

NewQrTagId

BIGINT

VehicleId

BIGINT

ReplacementReason

NVARCHAR(100)

ApprovedBy

BIGINT

ReplacedOn

DATETIME2



Replacement Reasons

Lost 

Stolen 

Damaged 

Manufacturing Defect 

Upgrade 



Rules

Old tag is permanently deactivated after replacement. 

Replacement history cannot be modified. 



QR Tag Lifecycle

Manufactured

      │

      ▼

Inventory

      │

      ▼

Sold

      │

      ▼

Assigned

      │

      ▼

Activated

      │

      ▼

Active Use

      │

 ┌────┴─────────────┐

 ▼                  ▼

Transferred      Replaced

 │                  │

 └──────────┬───────┘

            ▼

         Archived



Notification Workflow

QR Scan

   │

   ▼

Tag Validation

   │

   ▼

Notification Form

   │

   ▼

CAPTCHA Validation

   │

   ▼

Notification Created

   │

   ▼

Queue Processing

   │

   ▼

Email / SMS / Push

   │

   ▼

Owner Receives Alert

   │

   ▼

Owner Reads Notification



Abuse Prevention Rules

Maximum scan frequency per IP is configurable. 

CAPTCHA is required after repeated submissions. 

Duplicate notifications within a configurable time window may be merged or blocked. 

Suspicious activity is logged for administrator review. 

Invalid or suspended QR tags display a generic error page without exposing system details. 



Recommended Indexes

Index

Purpose

UQ_QrTag_SerialNumber

Fast tag lookup

IX_QrScanHistory_QrTagId_ScanTime

Scan analytics

IX_Notification_VehicleId

Notification history

IX_Notification_Status

Queue processing

IX_NotificationDelivery_Status

Delivery workers

IX_TagReplacementHistory_OldQrTagId

Replacement audit



Estimated Data Growth (5 Years)

Table

Estimated Rows

QrTag

5,000,000+

QrTagAssignment

8,000,000+

QrScanHistory

500,000,000+

Notification

150,000,000+

NotificationDelivery

450,000,000+

NotificationReadHistory

150,000,000+

TagReplacementHistory

2,000,000+

Recommendation: Given the expected volume, QrScanHistory, Notification, and NotificationDelivery should be partitioned by date, and delivery processing should use asynchronous background workers with queue-based architecture.



End of Part 4C

This section defines the platform's most critical operational workflow, from QR code creation through anonymous communication and delivery tracking.

Part 4D – Membership, Payments & Commerce Database Design

Version: 1.0



Module Overview

This module manages:

Membership Plans 

Membership Subscriptions 

Membership Benefits 

Membership Renewals 

Shopping Cart 

Orders 

Order Items 

Payment Processing 

Payment Transactions 

Invoices 

Coupons & Promotions 

Refund Management 

Tax Configuration 

Shipping & Fulfillment 



Module ER Diagram

                 MembershipPlan

                        │

                        ▼

                  Membership

                        │

          ┌─────────────┼─────────────┐

          ▼             ▼             ▼

 MembershipRenewal  Payment   MembershipBenefit

                        │

                        ▼

               PaymentTransaction

                        │

                        ▼

                    Invoice

User

 │

 ▼

ShoppingCart

 │

 ▼

Order

 │

 ├──────── OrderItem

 │

 ├──────── Payment

 │

 ├──────── Shipping

 │

 └──────── Coupon



Table 1 – MembershipPlan

Purpose

Defines all subscription plans available on the platform.



Columns

Column

Type

MembershipPlanId

BIGINT

PlanName

NVARCHAR(150)

PlanCode

NVARCHAR(50)

Description

NVARCHAR(MAX)

DurationMonths

INT

Price

DECIMAL(18,2)

Currency

NVARCHAR(10)

MaxVehicles

INT

MaxNotifications

INT

PrioritySupport

BIT

ReferralMultiplier

DECIMAL(5,2)

IsLifetime

BIT

IsActive

BIT



Example Plans

Plan

Price

Free

$0

Monthly Premium

$9.99

Annual Premium

$99.99

Lifetime Premium

$249.99



Table 2 – Membership

Purpose

Represents a customer's active or historical subscription.



Columns

Column

Type

MembershipId

BIGINT

UserId

BIGINT

MembershipPlanId

BIGINT

MembershipNumber

NVARCHAR(100)

StartDate

DATETIME2

EndDate

DATETIME2

AutoRenew

BIT

Status

NVARCHAR(30)

LastRenewedOn

DATETIME2

NextBillingDate

DATETIME2



Membership Status

Pending 

Active 

Grace Period 

Expired 

Suspended 

Cancelled 



Business Rules

A user may have only one active membership at a time. 

Lifetime memberships do not expire. 

Auto-renewal is available only for recurring plans. 



Table 3 – MembershipBenefit

Purpose

Defines benefits available under each plan.



Columns

Column

Type

BenefitId

BIGINT

MembershipPlanId

BIGINT

BenefitName

NVARCHAR(150)

BenefitDescription

NVARCHAR(500)

BenefitValue

NVARCHAR(100)



Example Benefits

Unlimited Notifications 

Priority Support 

Multiple Vehicles 

Discount on Replacement Tags 

Referral Bonus Multiplier 



Table 4 – MembershipRenewal

Purpose

Tracks every membership renewal event.



Columns

Column

Type

RenewalId

BIGINT

MembershipId

BIGINT

RenewalDate

DATETIME2

PreviousEndDate

DATETIME2

NewEndDate

DATETIME2

PaymentId

BIGINT

RenewalStatus

NVARCHAR(30)



Renewal Status

Successful 

Failed 

Pending 

Cancelled 



Table 5 – ShoppingCart

Purpose

Stores products awaiting checkout.



Columns

Column

Type

CartId

BIGINT

UserId

BIGINT

CreatedOn

DATETIME2

UpdatedOn

DATETIME2

Status

NVARCHAR(30)



Status

Active 

CheckedOut 

Abandoned 

Expired 



Table 6 – ShoppingCartItem

Purpose

Stores individual items within the shopping cart.



Columns

Column

Type

CartItemId

BIGINT

CartId

BIGINT

ProductType

NVARCHAR(50)

ProductId

BIGINT

Quantity

INT

UnitPrice

DECIMAL(18,2)

DiscountAmount

DECIMAL(18,2)

TotalPrice

DECIMAL(18,2)



Product Types

QR Tag 

Membership 

Replacement Tag 

Merchandise 



Table 7 – Order

Purpose

Represents a completed customer purchase.



Columns

Column

Type

OrderId

BIGINT

OrderNumber

NVARCHAR(100)

UserId

BIGINT

OrderDate

DATETIME2

Subtotal

DECIMAL(18,2)

Discount

DECIMAL(18,2)

Tax

DECIMAL(18,2)

Shipping

DECIMAL(18,2)

TotalAmount

DECIMAL(18,2)

Currency

NVARCHAR(10)

OrderStatus

NVARCHAR(30)



Order Status

Pending 

Confirmed 

Processing 

Completed 

Cancelled 

Refunded 



Table 8 – OrderItem

Purpose

Stores individual items purchased within an order.



Columns

Column

Type

OrderItemId

BIGINT

OrderId

BIGINT

ProductType

NVARCHAR(50)

ProductId

BIGINT

ProductName

NVARCHAR(200)

Quantity

INT

UnitPrice

DECIMAL(18,2)

Discount

DECIMAL(18,2)

Tax

DECIMAL(18,2)

Total

DECIMAL(18,2)



Table 9 – Payment

Purpose

Represents a customer payment associated with an order or membership.



Columns

Column

Type

PaymentId

BIGINT

OrderId

BIGINT NULL

MembershipId

BIGINT NULL

UserId

BIGINT

PaymentMethodId

BIGINT

Amount

DECIMAL(18,2)

Currency

NVARCHAR(10)

PaymentStatus

NVARCHAR(30)

GatewayReference

NVARCHAR(200)

PaidOn

DATETIME2



Payment Status

Pending 

Authorized 

Captured 

Failed 

Refunded 

Chargeback 



Table 10 – PaymentTransaction

Purpose

Stores gateway-level transaction details for reconciliation.



Columns

Column

Type

PaymentTransactionId

BIGINT

PaymentId

BIGINT

Gateway

NVARCHAR(100)

TransactionReference

NVARCHAR(200)

RequestPayload

NVARCHAR(MAX)

ResponsePayload

NVARCHAR(MAX)

Status

NVARCHAR(30)

ProcessedOn

DATETIME2



Supported Gateways

Stripe 

PayPal (Future) 

Authorize.Net (Future) 



Table 11 – Invoice

Purpose

Stores generated invoices.



Columns

Column

Type

InvoiceId

BIGINT

InvoiceNumber

NVARCHAR(100)

OrderId

BIGINT

UserId

BIGINT

IssueDate

DATETIME2

DueDate

DATETIME2

TotalAmount

DECIMAL(18,2)

Currency

NVARCHAR(10)

InvoiceStatus

NVARCHAR(30)

PdfUrl

NVARCHAR(500)



Invoice Status

Draft 

Issued 

Paid 

Overdue 

Cancelled 



Table 12 – Refund

Purpose

Tracks refunds issued to customers.



Columns

Column

Type

RefundId

BIGINT

PaymentId

BIGINT

RefundReference

NVARCHAR(100)

RefundAmount

DECIMAL(18,2)

RefundReason

NVARCHAR(500)

RefundStatus

NVARCHAR(30)

ProcessedBy

BIGINT

ProcessedOn

DATETIME2



Refund Status

Requested 

Approved 

Rejected 

Processed 

Failed 



Table 13 – Coupon

Purpose

Defines promotional codes.



Columns

Column

Type

CouponId

BIGINT

CouponCode

NVARCHAR(50)

Description

NVARCHAR(255)

DiscountType

NVARCHAR(20)

DiscountValue

DECIMAL(18,2)

MinimumOrderAmount

DECIMAL(18,2)

UsageLimit

INT

UsageCount

INT

ValidFrom

DATETIME2

ValidTo

DATETIME2

IsActive

BIT



Discount Types

Fixed Amount 

Percentage 

Free Shipping 



Business Rules

Coupons may have expiration dates. 

Usage limits are configurable. 

Coupons cannot reduce the order below zero. 



Table 14 – Shipping

Purpose

Tracks shipment of physical QR tags.



Columns

Column

Type

ShippingId

BIGINT

OrderId

BIGINT

Carrier

NVARCHAR(100)

TrackingNumber

NVARCHAR(100)

ShippingStatus

NVARCHAR(30)

ShippedDate

DATETIME2

DeliveredDate

DATETIME2



Shipping Status

Pending 

Packed 

Shipped 

In Transit 

Delivered 

Returned 



Table 15 – TaxConfiguration

Purpose

Defines tax rules by jurisdiction.



Columns

Column

Type

TaxConfigurationId

BIGINT

Country

NVARCHAR(100)

State

NVARCHAR(100)

TaxName

NVARCHAR(100)

TaxRate

DECIMAL(5,2)

EffectiveFrom

DATETIME2

EffectiveTo

DATETIME2

IsActive

BIT



Commerce Workflow

Customer Browses Products

          │

          ▼

     Add to Cart

          │

          ▼

       Checkout

          │

          ▼

Apply Coupon (Optional)

          │

          ▼

 Calculate Tax & Shipping

          │

          ▼

 Process Payment

          │

          ▼

 Generate Order

          │

          ▼

 Create Invoice

          │

          ▼

 Ship QR Tags (if applicable)

          │

          ▼

 Activate Membership / Fulfill Order



Financial Business Rules

Every successful payment must generate a corresponding payment transaction record. 

Every completed order must have an invoice. 

Refunds cannot exceed the original payment amount. 

Membership activation occurs only after confirmed payment. 

Coupon validation is performed at checkout. 

Tax calculations are based on the customer's shipping or billing jurisdiction. 

Order totals are immutable after completion; subsequent adjustments are handled through credit notes or refunds. 



Recommended Indexes

Index

Purpose

UQ_Membership_MembershipNumber

Membership lookup

UQ_Order_OrderNumber

Order lookup

UQ_Invoice_InvoiceNumber

Invoice lookup

IX_Payment_UserId

Payment history

IX_Order_OrderDate

Reporting

IX_Coupon_CouponCode

Coupon validation



Estimated Data Growth (5 Years)

Table

Estimated Rows

Membership

2,000,000+

MembershipRenewal

8,000,000+

ShoppingCart

5,000,000+

Order

15,000,000+

OrderItem

50,000,000+

Payment

20,000,000+

PaymentTransaction

40,000,000+

Invoice

20,000,000+

Refund

2,000,000+

Coupon

<10,000

Shipping

12,000,000+



Architectural Recommendations

To support enterprise-scale growth:

Use immutable financial records; avoid updates to finalized transactions. 

Store gateway request/response payloads in secure, encrypted storage where appropriate. 

Process payments and invoice generation asynchronously after gateway confirmation. 

Implement idempotency keys for payment callbacks to prevent duplicate processing. 

Use event-driven notifications (e.g., OrderCreated, PaymentCaptured, MembershipActivated) to decouple commerce workflows from downstream services. 



End of Part 4D

The Membership, Payments & Commerce module completes the financial domain of the TRAFFTAG platform, providing a robust foundation for subscriptions, QR tag sales, billing, taxation, invoicing, and fulfilment.

Part 4E – Referral, Rewards, Support & Administration Database Design

Version: 1.0



Module Overview

This module manages:

Referral Program 

Reward Wallet 

Reward Transactions 

Customer Support 

Support Conversations 

File Attachments 

CMS 

Banner Management 

FAQ 

System Settings 

Email Templates 

SMS Templates 

Background Jobs 

Notification Queue 

Application Configuration 



Module ER Diagram

                    User

                      │

          ┌───────────┴────────────┐

          ▼                        ▼

      Referral               SupportTicket

          │                        │

          ▼                        ▼

 ReferralReward           SupportMessage

          │                        │

          ▼                        ▼

 RewardTransaction     SupportAttachment



                      Administrator

                            │

      ┌──────────────┬──────────────┬─────────────┐

      ▼              ▼              ▼

   CMSPage        Banner          FAQ

      │

      ▼

SystemSetting



EmailTemplate



SMSTemplate



NotificationQueue



BackgroundJob



Table 1 – Referral

Purpose

Tracks every referral made by a customer.



Columns

Column

Type

ReferralId

BIGINT

ReferrerUserId

BIGINT

ReferredUserId

BIGINT

ReferralCode

NVARCHAR(50)

ReferralDate

DATETIME2

ReferralStatus

NVARCHAR(30)



Referral Status

Pending 

Registered 

Qualified 

Rewarded 

Expired 

Rejected 



Business Rules

Users cannot refer themselves. 

Referral codes are unique. 

Rewards are granted only after qualifying actions. 



Table 2 – ReferralReward

Purpose

Stores rewards earned through referrals.



Columns

Column

Type

RewardId

BIGINT

ReferralId

BIGINT

RewardType

NVARCHAR(50)

RewardValue

DECIMAL(18,2)

RewardStatus

NVARCHAR(30)

IssuedDate

DATETIME2

ExpiryDate

DATETIME2 NULL



Reward Types

Cash Credit 

Membership Extension 

Discount Coupon 

QR Tag Credit 

Reward Points 



Table 3 – RewardTransaction

Purpose

Maintains the reward wallet ledger.



Columns

Column

Type

RewardTransactionId

BIGINT

UserId

BIGINT

TransactionType

NVARCHAR(30)

ReferenceId

BIGINT

Points

DECIMAL(18,2)

BalanceAfter

DECIMAL(18,2)

Description

NVARCHAR(500)

TransactionDate

DATETIME2



Transaction Types

Credit 

Debit 

Expired 

Adjustment 

Bonus 



Business Rule

Reward balance must always equal the sum of all transactions.



Table 4 – SupportTicket

Purpose

Represents customer support requests.



Columns

Column

Type

TicketId

BIGINT

TicketNumber

NVARCHAR(100)

UserId

BIGINT

Category

NVARCHAR(100)

Subject

NVARCHAR(300)

Priority

NVARCHAR(20)

Status

NVARCHAR(30)

AssignedTo

BIGINT NULL

CreatedOn

DATETIME2

ClosedOn

DATETIME2 NULL



Priorities

Low 

Medium 

High 

Critical 



Status

Open 

Assigned 

In Progress 

Waiting for Customer 

Resolved 

Closed 



Table 5 – SupportMessage

Purpose

Stores conversations within support tickets.



Columns

Column

Type

MessageId

BIGINT

TicketId

BIGINT

SenderUserId

BIGINT

Message

NVARCHAR(MAX)

InternalNote

BIT

SentOn

DATETIME2



Rules

Internal notes are visible only to staff. 

Customer replies trigger notifications to the assigned agent. 



Table 6 – SupportAttachment

Purpose

Stores files attached to support messages.



Columns

Column

Type

AttachmentId

BIGINT

TicketId

BIGINT

MessageId

BIGINT

FileName

NVARCHAR(255)

FileUrl

NVARCHAR(500)

MimeType

NVARCHAR(100)

FileSize

BIGINT

UploadedOn

DATETIME2



Table 7 – CMSPage

Purpose

Stores editable website pages.



Columns

Column

Type

CMSPageId

BIGINT

Title

NVARCHAR(200)

Slug

NVARCHAR(200)

Content

NVARCHAR(MAX)

MetaTitle

NVARCHAR(255)

MetaDescription

NVARCHAR(500)

Language

NVARCHAR(20)

Published

BIT

PublishedOn

DATETIME2



Pages

Home 

About 

Pricing 

Contact 

Privacy Policy 

Terms & Conditions 

Refund Policy 

Cookie Policy 

Blog 



Table 8 – Banner

Purpose

Stores promotional banners.



Columns

Column

Type

BannerId

BIGINT

Title

NVARCHAR(200)

Subtitle

NVARCHAR(500)

ImageUrl

NVARCHAR(500)

ButtonText

NVARCHAR(100)

ButtonUrl

NVARCHAR(500)

DisplayOrder

INT

StartDate

DATETIME2

EndDate

DATETIME2

Active

BIT



Banner Locations

Homepage Hero 

Promotions 

Membership 

Checkout 

Dashboard 



Table 9 – FAQ

Purpose

Stores frequently asked questions.



Columns

Column

Type

FAQId

BIGINT

Category

NVARCHAR(100)

Question

NVARCHAR(500)

Answer

NVARCHAR(MAX)

DisplayOrder

INT

Active

BIT



Table 10 – SystemSetting

Purpose

Stores configurable application settings.



Columns

Column

Type

SettingId

BIGINT

SettingKey

NVARCHAR(150)

SettingValue

NVARCHAR(MAX)

Description

NVARCHAR(500)

Environment

NVARCHAR(50)

UpdatedOn

DATETIME2



Examples

CompanyName 

SupportEmail 

SMTPHost 

StripePublishableKey 

StripeSecretKey 

TwilioAccountSID 

MaxNotificationLength 

PasswordPolicy 

MaintenanceMode 

DefaultLanguage 



Table 11 – EmailTemplate

Purpose

Stores reusable email templates.



Columns

Column

Type

EmailTemplateId

BIGINT

TemplateName

NVARCHAR(100)

Subject

NVARCHAR(255)

HtmlBody

NVARCHAR(MAX)

Language

NVARCHAR(20)

Active

BIT



Templates

Welcome Email 

Verify Email 

Forgot Password 

Membership Renewal 

Payment Success 

QR Activated 

Notification Received 

Ticket Update 



Table 12 – SMSTemplate

Purpose

Stores reusable SMS templates.



Columns

Column

Type

SmsTemplateId

BIGINT

TemplateName

NVARCHAR(100)

MessageBody

NVARCHAR(500)

Language

NVARCHAR(20)

Active

BIT



Table 13 – NotificationQueue

Purpose

Stores pending outbound messages for asynchronous processing.



Columns

Column

Type

QueueId

BIGINT

NotificationType

NVARCHAR(30)

Recipient

NVARCHAR(255)

Payload

NVARCHAR(MAX)

Priority

INT

QueueStatus

NVARCHAR(30)

RetryCount

INT

ScheduledOn

DATETIME2

ProcessedOn

DATETIME2 NULL



Queue Status

Pending 

Processing 

Completed 

Failed 

Dead Letter 



Table 14 – BackgroundJob

Purpose

Tracks scheduled and recurring jobs.



Columns

Column

Type

BackgroundJobId

BIGINT

JobName

NVARCHAR(200)

JobType

NVARCHAR(100)

CronExpression

NVARCHAR(100)

LastRun

DATETIME2

NextRun

DATETIME2

LastStatus

NVARCHAR(30)

Enabled

BIT



Example Jobs

Membership Expiry Reminder 

Retry Failed Notifications 

Clean Expired Sessions 

Daily Database Backup Verification 

Weekly Analytics Aggregation 

Monthly Financial Report Generation 



Administration Workflows

Referral Workflow

Customer Shares Referral Code

            │

            ▼

New User Registers

            │

            ▼

Membership Purchased

            │

            ▼

Referral Verified

            │

            ▼

Reward Issued

            │

            ▼

Wallet Updated



Support Workflow

Customer Creates Ticket

           │

           ▼

Ticket Assigned

           │

           ▼

Agent Responds

           │

           ▼

Customer Replies

           │

           ▼

Issue Resolved

           │

           ▼

Ticket Closed



Notification Queue Workflow

Notification Created

          │

          ▼

Queued

          │

          ▼

Worker Picks Job

          │

          ▼

Provider API

          │

    ┌─────┴─────┐

    ▼           ▼

Success      Failure

    │           │

    ▼           ▼

Complete    Retry



Recommended Indexes

Index

Purpose

UQ_Referral_ReferralCode

Unique referral lookup

IX_RewardTransaction_UserId

Reward wallet history

UQ_SupportTicket_TicketNumber

Ticket lookup

IX_CMSPage_Slug

Page routing

IX_Banner_Active

Homepage rendering

IX_FAQ_Category

FAQ filtering

UQ_SystemSetting_SettingKey

Fast configuration lookup

IX_NotificationQueue_Status

Background processing



Estimated Data Growth (5 Years)

Table

Estimated Rows

Referral

5,000,000+

ReferralReward

5,000,000+

RewardTransaction

100,000,000+

SupportTicket

20,000,000+

SupportMessage

200,000,000+

NotificationQueue

500,000,000+

BackgroundJob

< 500

CMSPage

< 500

Banner

< 5,000

FAQ

< 10,000



Enterprise Recommendations

For long-term scalability and maintainability:

Use Hangfire, Quartz.NET, or a cloud-native scheduler for recurring background jobs. 

Decouple notification delivery using a message broker (e.g., RabbitMQ, Azure Service Bus, or Amazon SQS) instead of relying solely on database polling. 

Encrypt sensitive configuration values (API keys, SMTP credentials) using a secrets manager rather than storing them directly in SystemSetting. 

Implement versioning for CMS content and email templates to support rollbacks. 

Introduce a FeatureFlag table or integrate with a feature management service to enable controlled rollouts of new functionality. 

Separate operational reporting from transactional workloads by using read replicas or a reporting database. 



End of Part 4E

With this section, the logical database design for TRAFFTAG is substantially complete. Across Parts 4A–4E, we've defined the platform's major domains:

Identity & Security 

Customer & Vehicle Management 

QR Tags & Notifications 

Memberships & Commerce 

Referrals & Rewards 

Customer Support 

CMS & Administration 

Background Processing

Part 5 – Physical Database Design (PDD)

Document Version: 1.0

Database Platform: Microsoft SQL Server 2022 Enterprise



Table of Contents

Physical Database Overview 

SQL Server Standards 

Database File Layout 

Naming Standards 

Physical ERD 

Storage Strategy 

Primary Keys 

Foreign Keys 

Index Strategy 

Partitioning Strategy 

Compression Strategy 

SQL Server Security 

Stored Procedures 

Views 

Functions 

Triggers 

Database Jobs 

Backup Strategy 

Disaster Recovery 

Performance Optimization 



1. Physical Database Overview

The TRAFFTAG database is designed to support:

Millions of users 

Millions of QR Tags 

Hundreds of millions of notifications 

High transaction throughput 

Horizontal application scaling 

Read-heavy reporting workloads 

Near real-time notification processing 

The physical design prioritizes:

Performance 

Availability 

Scalability 

Data integrity 

Operational simplicity 



2. SQL Server Standards

SQL Version

Microsoft SQL Server 2022 Enterprise Edition



Database Collation

Latin1_General_100_CI_AS_SC_UTF8

Why:

Unicode support 

Case insensitive 

Accent sensitive 

UTF-8 storage efficiency 



Recovery Model

FULL

Reason:

Supports:

Point-in-time recovery 

Transaction log backups 

Disaster Recovery 



3. Database File Layout

Primary Filegroup

PRIMARY

Contains

System Objects 

Lookup Tables 

Configuration 



Transaction Filegroup

FG_TRANSACTION

Contains

Orders 

Payments 

Memberships 

Notifications 



Audit Filegroup

FG_AUDIT

Contains

Audit Logs 

Login History 



Archive Filegroup

FG_ARCHIVE

Contains

Archived Data



File Layout

TraffTagDB.mdf



Transaction1.ndf



Transaction2.ndf



Audit.ndf



Archive.ndf



TraffTagDB.ldf



4. Physical ER Diagram

User

 │

 ├──────── CustomerProfile

 │

 ├──────── Address

 │

 ├──────── Vehicle

 │          │

 │          ▼

 │      QrTagAssignment

 │          │

 │          ▼

 │       QrTag

 │          │

 │          ▼

 │     Notification

 │

 ├──────── Membership

 │          │

 │          ▼

 │       Payment

 │          │

 │          ▼

 │       Invoice

 │

 └──────── SupportTicket



5. Primary Key Strategy

Every transactional table uses:

BIGINT IDENTITY(1,1)

Example

UserId



VehicleId



NotificationId



Why BIGINT?

Supports billions of records.

Avoids future migration.



6. Foreign Key Strategy

Foreign Keys shall:

Enforce integrity

Prevent orphan records

Use:

ON DELETE NO ACTION

Soft delete preferred.



Example

FK_Vehicle_User



FK_Payment_User



FK_QrTagAssignment_Vehicle



7. Clustered Index Strategy

Clustered indexes should be on:

Primary Key

Example

PK_User



PK_Vehicle



PK_Notification

Exception:

Very large append-only tables (e.g., Notification, AuditLog) may benefit from clustering on a composite key such as (CreatedOn, NotificationId) if partitioning is date-based and aligns with access patterns.



8. Non-Clustered Index Strategy

Examples

User

Email



PhoneNumber

Vehicle

LicensePlate



VIN



UserId

Notification

VehicleId



Status



CreatedOn

Payment

UserId



Status



PaymentDate

Order

OrderNumber



OrderDate



9. Included Columns

Example

IX_Notification_Status

Include

VehicleId



NotificationDate



Priority

Reduces lookup operations.



10. Filtered Indexes

Example

Only Active Memberships

WHERE Status='Active'

Example

Only Active QR Tags

WHERE Status='Activated'

Example

Unread Notifications

WHERE Read=0

Filtered indexes improve query performance while reducing storage and maintenance overhead.



11. Partition Strategy

Very large tables should use partitioning.

Tables

Notification

AuditLog

LoginHistory

PaymentTransaction

QrScanHistory

SupportMessage



Partition Key

CreatedOn

Monthly partitions recommended.



Partition Example

2026_01



2026_02



2026_03



...

Benefits

Faster queries 

Faster archiving 

Easier maintenance 

Online partition switching 



12. Data Compression

Recommended

PAGE Compression

For

AuditLog

Notification

LoginHistory



ROW Compression

For

Membership

Users

Vehicle



Compression reduces storage while maintaining acceptable performance.



13. SQL Server Security

Authentication

Windows Authentication (internal)

SQL Login (application)



Permissions

Application User

db_datareader

db_datawriter

Execute Stored Procedures



No direct table access from external applications.

The application should access data through a controlled data access layer and stored procedures where appropriate.



14. Stored Procedure Standards

Stored procedure naming convention:

usp_<Module>_<Action>

Examples

usp_User_Register



usp_User_Login



usp_Vehicle_Create



usp_Vehicle_Update



usp_QrTag_Activate



usp_QrTag_Assign



usp_Notification_Create



usp_Notification_GetByVehicle



usp_Membership_Renew



usp_Order_Create



usp_Payment_Process



usp_Report_Revenue



Stored Procedure Categories

Authentication

usp_User_Register 

usp_User_Login 

usp_User_ChangePassword 

usp_User_ResetPassword 

Vehicle

usp_Vehicle_Create 

usp_Vehicle_Update 

usp_Vehicle_Delete 

usp_Vehicle_Search 

QR Tags

usp_QrTag_Generate 

usp_QrTag_Activate 

usp_QrTag_Replace 

usp_QrTag_Transfer 

Notifications

usp_Notification_Create 

usp_Notification_Search 

usp_Notification_GetUnread 

usp_Notification_MarkRead 

Membership

usp_Membership_Purchase 

usp_Membership_Renew 

usp_Membership_Cancel 

Commerce

usp_Order_Checkout 

usp_Payment_Capture 

usp_Invoice_Generate 

usp_Refund_Process 

Reporting

usp_Report_DailySales 

usp_Report_UserGrowth 

usp_Report_QrUsage 

usp_Report_Revenue 



15. Database Views

Views simplify reporting and API development.

Recommended Views:

vwActiveMembers



vwVehicleSummary



vwNotificationHistory



vwDailyRevenue



vwMembershipExpiry



vwUnreadNotifications



vwDashboardStatistics



vwFleetSummary



vwUserActivity



vwPaymentHistory

Views should avoid business logic and primarily support read operations.



16. SQL Functions

Scalar Functions

fn_GetMembershipStatus()



fn_CalculateReward()



fn_FormatLicensePlate()



fn_IsMembershipExpired()

Table-Valued Functions

fn_GetUserVehicles()



fn_GetUnreadNotifications()



fn_GetUserRewards()



fn_GetVehicleHistory()



17. Database Triggers

Triggers should be used sparingly.

Recommended Uses

Audit

TR_User_Audit



TR_Vehicle_Audit



TR_QrTag_Audit

Inventory

TR_QrTag_Status

Avoid placing business logic in triggers; prefer application services or stored procedures.



18. SQL Server Agent Jobs

Recommended Jobs

Daily Backup

Index Rebuild

Statistics Update

Archive Old Notifications

Archive Audit Logs

Membership Expiry Processing

Cleanup Refresh Tokens

Retry Failed Notifications

Generate Daily Reports

Verify Database Integrity (DBCC CHECKDB)



19. Backup Strategy

Full Backup

Daily

Differential

Every Hour

Transaction Log

Every 15 Minutes

Backup Verification

Daily Restore Test (to a non-production environment)

Retention

Daily: 30 Days

Weekly: 3 Months

Monthly: 12 Months

Yearly: 7 Years (subject to compliance requirements)



20. Disaster Recovery

Recovery Time Objective (RTO)

≤ 4 Hours

Recovery Point Objective (RPO)

≤ 15 Minutes

Recommended Architecture

Primary SQL Server 

Secondary Availability Replica (Always On Availability Groups) 

Off-site encrypted backups 

Automated failover where appropriate 



21. Performance Optimization

General Guidelines

Use parameterized queries. 

Avoid SELECT *. 

Use pagination for large datasets. 

Use asynchronous processing for notifications. 

Cache frequently accessed reference data. 

Maintain index statistics regularly. 

Monitor query plans for regressions. 

Implement deadlock monitoring and retry strategies. 



22. High Availability Architecture

                Load Balancer

                      │

          ┌───────────┴───────────┐

          ▼                       ▼

     App Server 1            App Server 2

          │                       │

          └───────────┬───────────┘

                      │

               SQL Server AG

          ┌───────────┴───────────┐

          ▼                       ▼

   Primary Replica         Secondary Replica

                      │

                      ▼

               Off-site Backup



23. Database Maintenance Plan

Task

Frequency

Update Statistics

Daily

Reorganize Fragmented Indexes

Weekly

Rebuild Highly Fragmented Indexes

Weekly

DBCC CHECKDB

Weekly

Backup Verification

Daily

Purge Temporary Data

Daily

Archive Historical Data

Monthly

Capacity Review

Monthly



24. Implementation Standards

All schema changes must be version-controlled using Entity Framework Core migrations or SQL migration scripts. 

Every database change must include a rollback strategy. 

All DDL changes should be tested in development and staging environments before production deployment. 

Use transactions for multi-table operations to ensure consistency. 

Adopt naming and coding standards consistently across all database objects. 



End of Part 5

At this stage, the database architecture is implementation-ready. Combined with Parts 4A–4E, this provides a comprehensive blueprint for building the SQL Server database.

Part 6 – REST API & Backend Service Specification

Version: 1.0

Architecture Style: RESTful API

Backend Framework: ASP.NET Core 8 Web API

Authentication: JWT + Refresh Token

Data Format: JSON

API Version: v1



Table of Contents

API Overview 

API Standards 

Authentication 

Request & Response Standards 

Error Handling 

API Security 

Authentication APIs 

User APIs 

Vehicle APIs 

QR Tag APIs 

Notification APIs 

Membership APIs 

Payment APIs 

Referral APIs 

Support APIs 

Administration APIs 

Webhooks 

Rate Limiting 

API Versioning 



1. API Overview

The TRAFFTAG platform exposes a RESTful API that enables communication between:

React Web Application 

Native Mobile Applications 

Administrative Portal 

Third-Party Integrations 

Internal Background Services 

Base URL

Production:

https://api.trafftag.com/api/v1/



Staging:

https://staging-api.trafftag.com/api/v1/



Development:

https://localhost:5001/api/v1/



2. API Design Principles

All APIs must:

Be RESTful 

Be stateless 

Use HTTPS only 

Return JSON 

Use UTC timestamps (ISO 8601) 

Support pagination 

Be versioned 

Provide consistent error responses 

Be documented with OpenAPI/Swagger 



3. HTTP Methods

Method

Purpose

GET

Retrieve data

POST

Create resource

PUT

Replace resource

PATCH

Partial update

DELETE

Soft delete where applicable



4. Standard Response Format

Success

{

  "success": true,

  "message": "Vehicle created successfully.",

  "data": {

    "vehicleId": 101

  }

}



Validation Error

{

  "success": false,

  "errorCode": "VALIDATION_ERROR",

  "message": "Validation failed.",

  "errors": [

    {

      "field": "LicensePlate",

      "message": "License plate is required."

    }

  ]

}



Unauthorized

{

  "success": false,

  "errorCode": "UNAUTHORIZED",

  "message": "Authentication required."

}



5. HTTP Status Codes

Code

Meaning

200

OK

201

Created

204

No Content

400

Bad Request

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

422

Validation Failed

429

Too Many Requests

500

Internal Server Error



6. Authentication

Most endpoints require:

Authorization: Bearer {JWT_TOKEN}

Public endpoints include:

Register 

Login 

Forgot Password 

Verify Email 

Scan QR Code 

Submit Notification 



7. Authentication Module APIs



Register User

POST /auth/register

Request

{

  "firstName": "John",

  "lastName": "Smith",

  "email": "john@example.com",

  "phoneNumber": "+15551234567",

  "password": "StrongPassword123!"

}

Response

{

  "success": true,

  "message": "Registration successful. Please verify your email."

}



Login

POST /auth/login

Request

{

  "email": "john@example.com",

  "password": "StrongPassword123!"

}

Response

{

  "accessToken": "jwt...",

  "refreshToken": "refresh...",

  "expiresIn": 3600,

  "user": {

    "userId": 1,

    "email": "john@example.com",

    "roles": ["Customer"]

  }

}



Refresh Token

POST /auth/refresh



Logout

POST /auth/logout



Forgot Password

POST /auth/forgot-password



Reset Password

POST /auth/reset-password



Verify Email

POST /auth/verify-email



8. User Module APIs

Get Profile

GET /users/me



Update Profile

PUT /users/me



Upload Profile Image

POST /users/me/profile-image

Multipart/form-data



Change Password

POST /users/me/change-password



Notification Preferences

PUT /users/me/preferences



9. Vehicle Module APIs

List Vehicles

GET /vehicles

Supports:

Pagination 

Search 

Status Filter 



Get Vehicle

GET /vehicles/{vehicleId}



Create Vehicle

POST /vehicles

Example Request

{

  "makeId": 1,

  "modelId": 12,

  "year": 2024,

  "licensePlate": "ABC123",

  "registrationState": "CA",

  "color": "Black"

}



Update Vehicle

PUT /vehicles/{vehicleId}



Delete Vehicle

DELETE /vehicles/{vehicleId}

Soft Delete



Upload Vehicle Images

POST /vehicles/{vehicleId}/images



Upload Documents

POST /vehicles/{vehicleId}/documents



10. QR Tag APIs

Activate QR

POST /qrtags/activate



Assign QR

POST /qrtags/{qrTagId}/assign



Replace QR

POST /qrtags/{qrTagId}/replace



Transfer QR

POST /qrtags/{qrTagId}/transfer



QR Details

GET /qrtags/{qrTagId}



QR Scan (Public)

GET /scan/{qrCode}

Returns

Tag Valid? 

Vehicle Exists? 

Notification Form Metadata 

No owner information is returned.



11. Notification APIs

Submit Notification (Public)

POST /notifications

Example Request

{

  "qrTagId": 101,

  "category": "Flat Tire",

  "message": "Rear left tire appears flat.",

  "finderPhone": "+15559876543"

}



Notification History

GET /notifications



Notification Details

GET /notifications/{notificationId}



Mark as Read

PATCH /notifications/{notificationId}/read



Delete Notification

DELETE /notifications/{notificationId}

Archive Only



12. Membership APIs

Available Plans

GET /memberships/plans



Purchase Membership

POST /memberships/purchase



Current Membership

GET /memberships/current



Membership History

GET /memberships/history



Cancel Auto Renewal

POST /memberships/cancel-auto-renew



13. Payment APIs

Checkout

POST /payments/checkout



Payment Status

GET /payments/{paymentId}



Payment History

GET /payments/history



Download Invoice

GET /payments/{paymentId}/invoice



Request Refund

POST /payments/{paymentId}/refund



14. Referral APIs

Get Referral Dashboard

GET /referrals/dashboard



Referral History

GET /referrals/history



Reward Transactions

GET /rewards/history



Share Referral

POST /referrals/share



15. Support APIs

Create Ticket

POST /support/tickets



Ticket List

GET /support/tickets



Ticket Details

GET /support/tickets/{ticketId}



Reply

POST /support/tickets/{ticketId}/reply



Upload Attachment

POST /support/tickets/{ticketId}/attachments



Close Ticket

PATCH /support/tickets/{ticketId}/close



16. Administration APIs

These endpoints require Administrator or Super Administrator privileges.

Users

GET    /admin/users

GET    /admin/users/{id}

PATCH  /admin/users/{id}

DELETE /admin/users/{id}

Vehicles

GET /admin/vehicles

QR Tags

POST /admin/qrtags/generate

Memberships

GET /admin/memberships

Payments

GET /admin/payments

Reports

GET /admin/reports/revenue

GET /admin/reports/users

GET /admin/reports/notifications

CMS

GET /admin/cms/pages

PUT /admin/cms/pages/{id}



17. Webhooks

Supported inbound webhook endpoints:

POST /webhooks/stripe 

POST /webhooks/sendgrid 

POST /webhooks/twilio 

Requirements:

Signature verification 

Idempotency checks 

Event logging 

Retry handling 



18. Rate Limiting

Recommended defaults:

Endpoint

Limit

Login

10 requests / minute / IP

Register

5 requests / hour / IP

QR Scan

100 requests / minute / IP

Notification Submission

20 requests / hour / IP

Password Reset

5 requests / hour / email

Limits should be configurable and monitored.



19. Pagination Standard

Collection endpoints support:

GET /vehicles?page=1&pageSize=20&sort=createdOn_desc

Response metadata:

{

  "page": 1,

  "pageSize": 20,

  "totalRecords": 145,

  "totalPages": 8,

  "data": []

}



20. Filtering & Searching

Example:

GET /notifications?status=Delivered&priority=High&from=2026-01-01&to=2026-01-31

Search should support:

Exact match 

Partial match (where appropriate) 

Date ranges 

Sorting 

Multiple filters 



21. API Versioning

Version is included in the URL:

/api/v1/

/api/v2/

Breaking changes require a new major API version. Backward-compatible additions should be introduced within the current version where possible.



22. API Documentation

Every endpoint should be documented using OpenAPI (Swagger), including:

Summary and description 

Authentication requirements 

Request schema 

Response schema 

Example requests and responses 

Validation rules 

Possible error codes 

Role requirements 



End of Part 6 – Section 1

This section defines the core REST API contract for authentication, user management, vehicles, QR tags, notifications, memberships, payments, referrals, support, administration, and integration points.

Part 6A – Authentication, Identity & User APIs

Version: 1.0



API Standards

Base URL

https://api.trafftag.com/api/v1

Content-Type

Content-Type: application/json

Authentication

Protected APIs require:

Authorization: Bearer {JWT}



Authentication Flow

Register

    │

    ▼

Email Verification

    │

    ▼

Login

    │

    ▼

JWT + Refresh Token

    │

    ▼

Authorized APIs

    │

    ▼

Refresh Token

    │

    ▼

Logout



Module 1 – Authentication APIs



API 1

Register User

Endpoint

POST /auth/register



Description

Creates a new TRAFFTAG account.



Authentication

Not Required



Roles

Public



Request DTO

Field

Type

Required

Validation

FirstName

string

Yes

2–100 characters

LastName

string

Yes

2–100 characters

Email

string

Yes

Valid email

PhoneNumber

string

Yes

E.164 format

Password

string

Yes

See password policy

AcceptTerms

bool

Yes

Must be true

ReferralCode

string

No

Existing referral



Password Policy

Minimum 12 characters

Must contain:

Uppercase 

Lowercase 

Number 

Special Character 

Cannot contain:

Email 

Phone Number 

Common passwords 



Example Request

{

  "firstName":"John",

  "lastName":"Smith",

  "email":"john@example.com",

  "phoneNumber":"+15551234567",

  "password":"MySecure@Password123",

  "acceptTerms":true,

  "referralCode":"ABC123"

}



Business Rules

Email must be unique. 

Phone number must be unique. 

Terms must be accepted. 

Password must satisfy the policy. 

Referral code is validated if provided. 

User account is created in a pending state until email verification. 



Success Response

201 Created

{

  "success": true,

  "message": "Registration successful. Please verify your email.",

  "data": {

    "userId": 10234,

    "verificationRequired": true

  }

}



Error Codes

Code

Description

AUTH001

Email already exists

AUTH002

Phone already exists

AUTH003

Weak password

AUTH004

Invalid referral code

AUTH005

Terms not accepted



Audit Log

Generate:

User Registered



API 2

Verify Email

POST /auth/verify-email



Request

{

    "token":"verification-token"

}



Business Rules

Token expires in 24 hours. 

Token is single-use. 

Successful verification activates the account. 



Success

{

    "success":true,

    "message":"Email verified successfully."

}



API 3

Login

POST /auth/login



Request DTO

Field

Required

Email

Yes

Password

Yes

RememberMe

No



Processing Steps

Validate request. 

Find user. 

Check account status. 

Verify password. 

Check lockout. 

Generate JWT. 

Generate Refresh Token. 

Save Refresh Token. 

Record Login History. 

Return tokens. 



Success Response

{

    "success":true,

    "data":{

        "accessToken":"...",

        "refreshToken":"...",

        "expiresIn":3600,

        "user":{

            "userId":1,

            "fullName":"John Smith",

            "email":"john@example.com",

            "roles":["Customer"]

        }

    }

}



Login Failure Reasons

Invalid Email

Invalid Password

Account Locked

Account Disabled

Email Not Verified

Password Expired



Audit Events

Successful Login

Failed Login

Account Lockout



API 4

Refresh Token

POST /auth/refresh



Business Rules

Old Refresh Token becomes invalid.

New Refresh Token generated.

Refresh Token rotation enforced.



API 5

Logout

POST /auth/logout



Business Rules

Invalidate Refresh Token.

Record Logout Time.

Audit Logout.



API 6

Forgot Password

POST /auth/forgot-password



Request

{

    "email":"john@example.com"

}



Processing

Generate secure token.

Email reset link.

Token expires after configurable duration (recommended: 30 minutes).



API 7

Reset Password

POST /auth/reset-password



Request

{

    "token":"...",

    "password":"NewPassword123!"

}



Business Rules

Invalidate all Refresh Tokens.

Clear failed login attempts.

Send confirmation email.



Module 2 – User Profile APIs



API 8

Get Current User

GET /users/me



Response

{

    "userId":1,

    "firstName":"John",

    "lastName":"Smith",

    "email":"john@example.com",

    "membership":"Premium",

    "profileCompletion":95

}



API 9

Update Profile

PUT /users/me



Editable Fields

First Name

Last Name

Phone

Language

Timezone

Marketing Consent

Emergency Contact



Validation

Phone unique.

Language supported.

Timezone valid IANA identifier (e.g., America/New_York, Asia/Kolkata).



API 10

Upload Profile Picture

POST /users/me/profile-image



Multipart Form

JPEG

PNG

WEBP

Max Size

5 MB



API 11

Change Password

POST /users/me/change-password



Request

{

    "currentPassword":"...",

    "newPassword":"..."

}



Rules

Current Password required.

New Password cannot equal current password.

All active sessions except the current one may be revoked based on security policy.



API 12

Delete Account

DELETE /users/me



Business Rules

Soft Delete.

Membership cancelled according to refund policy.

Vehicles archived.

QR Tags deactivated.

Data retained according to retention policy.



API 13

Notification Preferences

PUT /users/me/preferences



Example

{

    "emailNotifications":true,

    "smsNotifications":true,

    "pushNotifications":true,

    "marketingEmails":false,

    "language":"en-US"

}



API 14

Active Sessions

GET /users/me/sessions



Response

Current Device

Browser

IP

Last Activity

Location (Approximate)



API 15

Revoke Session

DELETE /users/me/sessions/{sessionId}



Business Rules

Cannot revoke the current session unless explicitly requested.

Revoked sessions invalidate associated refresh tokens immediately.



Authorization Matrix

Endpoint

Public

Customer

Support

Admin

Register

✔

✖

✖

✖

Login

✔

✖

✖

✖

Verify Email

✔

✖

✖

✖

Forgot Password

✔

✖

✖

✖

Reset Password

✔

✖

✖

✖

Get Profile

✖

✔

✔ (limited)

✔

Update Profile

✖

✔

✔ (own profile)

✔

Change Password

✖

✔

✔

✔

Active Sessions

✖

✔

✔

✔

Delete Account

✖

✔

✖

✔ (administrative action)



Security Requirements

JWT access token lifetime: 15–30 minutes (configurable). 

Refresh token lifetime: 30–90 days (configurable). 

Refresh token rotation on every refresh request. 

Account lockout after configurable failed login attempts. 

CAPTCHA required after repeated authentication failures. 

MFA support for administrators and optional for customers. 

All passwords hashed using Argon2id (preferred) or bcrypt with appropriate work factors. 

Sensitive endpoints protected against brute-force attacks using rate limiting and anomaly detection. 



Error Catalog (Authentication & User Module)

Error Code

Description

HTTP Status

AUTH001

Email already exists

409

AUTH002

Phone number already exists

409

AUTH003

Password does not meet policy

422

AUTH004

Invalid email verification token

400

AUTH005

Account not verified

403

AUTH006

Invalid credentials

401

AUTH007

Account locked

423

AUTH008

Refresh token expired or revoked

401

USER001

Profile not found

404

USER002

Unsupported language

422

USER003

Invalid timezone

422



End of Part 6A – Section 1

This section fully specifies the Authentication and User Management APIs, including request/response models, business rules, validation, security requirements, authorization, and standardized error handling.

Part 6A – Section 2

Vehicle & QR Tag APIs

Version: 1.0



Module Overview

This module provides APIs for:

Vehicle Management 

Vehicle Images 

Vehicle Documents 

Vehicle Preferences 

Fleet Management 

QR Tag Activation 

QR Tag Assignment 

QR Tag Replacement 

QR Tag Transfer 

QR Scan 

QR Validation 

Anonymous Notifications 



Vehicle Management Workflow

Register Vehicle

      │

      ▼

Upload Images

      │

      ▼

Upload Documents

      │

      ▼

Activate QR Tag

      │

      ▼

Assign QR Tag

      │

      ▼

Vehicle Active

      │

      ▼

Receive Notifications



Module 3 – Vehicle APIs



API 16

List Vehicles

Endpoint

GET /vehicles

Authentication

Required

Roles

Customer 

Fleet Manager 

Administrator 



Query Parameters

Parameter

Type

Required

Description

page

int

No

Default 1

pageSize

int

No

Default 20

search

string

No

Plate, VIN, Nickname

status

string

No

Active, Sold, Archived

sort

string

No

createdOn_desc



Response

{

  "page":1,

  "pageSize":20,

  "totalRecords":35,

  "data":[

    {

      "vehicleId":12,

      "nickname":"Family SUV",

      "licensePlate":"ABC123",

      "make":"Toyota",

      "model":"Fortuner",

      "year":2024,

      "status":"Active",

      "activeQrTag":"TT-00012345"

    }

  ]

}



API 17

Get Vehicle

GET /vehicles/{vehicleId}



Returns

Vehicle Details

QR Tag

Documents

Images

Notification Settings



Authorization

Owner or Administrator only.



API 18

Register Vehicle

POST /vehicles



Request DTO

Field

Validation

MakeId

Required

ModelId

Required

Year

1900–Current Year + 1

VIN

Optional, exactly 17 characters if provided

LicensePlate

Required

Color

Required

NickName

Optional



Business Rules

VIN must be unique.

License Plate unique per jurisdiction.

Vehicle limit depends on Membership.



Success

{

  "vehicleId":91,

  "message":"Vehicle registered successfully."

}



Errors

VEH001

Duplicate VIN

VEH002

Duplicate License Plate

VEH003

Membership Limit Reached



API 19

Update Vehicle

PUT /vehicles/{vehicleId}



Editable Fields

Color

Nickname

Registration

Insurance

Preferences



Cannot Change

Vehicle Owner

Historical Records



API 20

Archive Vehicle

DELETE /vehicles/{vehicleId}



Business Rules

Soft Delete

Vehicle archived

QR deactivated

Notifications retained



API 21

Upload Vehicle Images

POST /vehicles/{vehicleId}/images



Multipart Upload

Maximum

10 Images



Supported Formats

JPEG

PNG

WEBP



Maximum Size

10 MB



Image Categories

Front

Rear

Interior

Registration

Insurance

Damage



API 22

Upload Vehicle Documents

POST /vehicles/{vehicleId}/documents



Supported

PDF

JPEG

PNG



Maximum Size

20 MB



Document Types

Registration

Insurance

Inspection

Purchase Invoice

Ownership



API 23

Vehicle Notification Preferences

PUT /vehicles/{vehicleId}/preferences



Example

{

    "receiveSMS":true,

    "receiveEmail":true,

    "receivePush":true,

    "silentHours":{

        "start":"22:00",

        "end":"06:00"

    }

}



API 24

Vehicle History

GET /vehicles/{vehicleId}/history



Returns

Ownership

QR Assignments

Notifications

Changes

Audit Events



Module 4 – QR Tag APIs



API 25

Activate QR Tag

POST /qrtags/activate



Request

{

    "serialNumber":"TT00001234",

    "activationCode":"982611"

}



Processing

Validate Tag

↓

Check Sold

↓

Check Already Activated

↓

Assign to Customer

↓

Ready for Vehicle Assignment



Errors

QR001

Invalid QR

QR002

Already Activated

QR003

Suspended

QR004

Lost

QR005

Stolen



API 26

Assign QR Tag

POST /qrtags/{qrTagId}/assign



Request

{

    "vehicleId":18

}



Business Rules

Vehicle cannot already have active QR

QR cannot already be assigned

Owner must own vehicle



API 27

Replace QR Tag

POST /qrtags/{qrTagId}/replace



Request

{

    "reason":"Damaged"

}



Replacement Reasons

Lost

Stolen

Damaged

Upgrade

Manufacturing Defect



Processing

Deactivate Old QR

↓

Generate Replacement

↓

Transfer History

↓

Assign New QR



API 28

Transfer QR

POST /qrtags/{qrTagId}/transfer



Request

{

    "vehicleId":55

}



Business Rules

Same Owner Only

History Preserved

Old Assignment Closed



API 29

Get QR Details

GET /qrtags/{qrTagId}



Returns

Status

Vehicle

Assignment

Activation Date

Scan Count

Notification Count



API 30

QR Scan (Public)

GET /scan/{encodedQR}



Authentication

Not Required



Response

{

    "valid":true,

    "vehicleExists":true,

    "notificationAllowed":true,

    "categories":[

        "Flat Tire",

        "Blocking Driveway",

        "Lights On"

    ]

}



Never Return

Owner Name

Phone

Email

Address

Membership

Vehicle Registration Details



API 31

Submit Anonymous Notification

POST /notifications



Authentication

Public



Request

{

    "qrTagId":91,

    "category":"Flat Tire",

    "message":"Rear left tire looks flat.",

    "finderPhone":"+15551234567",

    "captchaToken":"..."

}



Validation

QR Exists

QR Active

CAPTCHA Valid

Message Length

Rate Limit

Spam Detection



Processing

Create Notification

↓

Queue

↓

Email

↓

SMS

↓

Push

↓

Audit



Success

{

    "success":true,

    "message":"Notification sent successfully."

}



Errors

NOT001

Invalid QR

NOT002

Spam Detected

NOT003

Rate Limit

NOT004

CAPTCHA Failed



Fleet APIs



API 32

Fleet Vehicle List

GET /fleet/vehicles



Returns

Vehicles

Assigned Drivers

QR Status

Membership



API 33

Assign Driver

POST /fleet/vehicles/{vehicleId}/driver



Request

{

    "driverName":"Michael Smith",

    "phone":"+15551111111"

}



API 34

Fleet Dashboard

GET /fleet/dashboard



Widgets

Vehicle Count

QR Count

Notifications Today

Expiring Registrations

Expiring Insurance



QR Security Rules

Every QR code must:

Have globally unique identity

Not expose database IDs

Be digitally signed or contain an HMAC to prevent tampering

Use HTTPS-only URLs

Reject replay or malformed requests



Authorization Matrix

Endpoint

Public

Customer

Fleet

Admin

Scan QR

✔

✔

✔

✔

Submit Notification

✔

✔

✔

✔

Register Vehicle

✖

✔

✔

✔

Upload Images

✖

✔

✔

✔

Activate QR

✖

✔

✔

✔

Assign QR

✖

✔

✔

✔

Replace QR

✖

✔

✔

✔

Transfer QR

✖

✔

✔

✔

Fleet Dashboard

✖

✖

✔

✔



Vehicle Error Catalog

Code

Description

HTTP

VEH001

Duplicate VIN

409

VEH002

Duplicate License Plate

409

VEH003

Membership Vehicle Limit Reached

403

VEH004

Vehicle Not Found

404

VEH005

Vehicle Already Archived

409



QR Error Catalog

Code

Description

HTTP

QR001

QR Not Found

404

QR002

Already Activated

409

QR003

Suspended

403

QR004

Lost

403

QR005

Stolen

403

QR006

Already Assigned

409

QR007

Invalid Activation Code

422



Notification Error Catalog

Code

Description

HTTP

NOT001

Invalid QR Tag

404

NOT002

CAPTCHA Validation Failed

422

NOT003

Rate Limit Exceeded

429

NOT004

Spam Detection Triggered

403

NOT005

Notification Delivery Failed

500



Performance Requirements

API

SLA

Get Vehicles

≤ 300 ms

Register Vehicle

≤ 500 ms

Activate QR

≤ 800 ms

Scan QR

≤ 200 ms

Submit Notification

≤ 1 second

Upload Image

≤ 3 seconds

Fleet Dashboard

≤ 2 seconds



End of Part 6A – Section 2

This section completes the API specification for the platform's core operational features, including vehicle management, QR lifecycle management, anonymous notifications, and fleet functionality.

Part 6A – Section 3

Membership, Payments, Commerce, Referral, Support & Administration APIs

Version: 1.0



Module Overview

This section defines APIs for:

Membership Management 

Checkout & Orders 

Payment Processing 

Invoices & Refunds 

Referral & Rewards 

Customer Support 

CMS 

Administration 

Analytics & Reporting 

Webhooks 

Background Jobs 



Membership Workflow

View Plans

      │

      ▼

Select Plan

      │

      ▼

Checkout

      │

      ▼

Payment Gateway

      │

      ▼

Webhook Confirmation

      │

      ▼

Membership Activated

      │

      ▼

Invoice Generated

      │

      ▼

Confirmation Notification



Module 5 – Membership APIs



API 35

Get Membership Plans

Endpoint

GET /memberships/plans

Authentication

Not Required

Response

{

  "plans": [

    {

      "planId": 1,

      "name": "Premium Monthly",

      "price": 9.99,

      "currency": "USD",

      "durationMonths": 1,

      "maxVehicles": 10,

      "features": [

        "Unlimited Notifications",

        "Priority Support"

      ]

    }

  ]

}



API 36

Purchase Membership

POST /memberships/purchase

Request

{

  "membershipPlanId":2,

  "paymentMethod":"Stripe",

  "couponCode":"SAVE20"

}

Processing

Validate Plan

↓

Validate Coupon

↓

Create Order

↓

Redirect to Payment



API 37

Current Membership

GET /memberships/current

Returns

Plan 

Expiry 

Benefits 

Auto Renew 

Remaining Days 



API 38

Membership History

GET /memberships/history



API 39

Cancel Auto Renewal

POST /memberships/cancel-auto-renew



Business Rule

Membership remains active until expiration.



Module 6 – Checkout & Orders



API 40

Checkout

POST /checkout



Request

{

  "cartId":19,

  "shippingAddressId":8,

  "paymentMethod":"Stripe"

}



Processing

Validate Cart

↓

Calculate Tax

↓

Apply Coupon

↓

Create Order

↓

Generate Payment

↓

Return Payment URL



API 41

Get Orders

GET /orders

Supports

Search

Pagination

Status

Date Range



API 42

Get Order Details

GET /orders/{orderId}



API 43

Cancel Order

POST /orders/{orderId}/cancel

Business Rules

Only before shipment.



Module 7 – Payment APIs



API 44

Create Payment Session

POST /payments/session



Response

{

    "paymentUrl":"https://checkout.stripe.com/..."

}



API 45

Payment Status

GET /payments/{paymentId}



Returns

Gateway

Status

Amount

Currency

Transaction ID



API 46

Payment History

GET /payments/history



API 47

Download Invoice

GET /payments/{paymentId}/invoice

Returns

PDF



API 48

Refund Request

POST /payments/{paymentId}/refund



Request

{

    "reason":"Purchased by mistake."

}



Workflow

Customer Request

↓

Admin Review

↓

Gateway Refund

↓

Invoice Adjustment

↓

Customer Notification



Module 8 – Referral APIs



API 49

Referral Dashboard

GET /referrals/dashboard

Returns

Referral Code

Referral Link

Total Referrals

Pending Rewards

Wallet Balance



API 50

Referral History

GET /referrals/history



API 51

Reward Wallet

GET /rewards/wallet



Response

{

    "balance":42.5,

    "currency":"USD"

}



API 52

Reward Transactions

GET /rewards/history



API 53

Share Referral

POST /referrals/share



Channels

Email

SMS

WhatsApp

Facebook

Copy Link



Module 9 – Support APIs



API 54

Create Ticket

POST /support/tickets



API 55

List Tickets

GET /support/tickets



API 56

Ticket Details

GET /support/tickets/{ticketId}



API 57

Reply

POST /support/tickets/{ticketId}/reply



API 58

Upload Attachment

POST /support/tickets/{ticketId}/attachments



API 59

Close Ticket

PATCH /support/tickets/{ticketId}/close



Module 10 – Administration APIs

These endpoints require Administrator or Super Administrator privileges.



API 60

Dashboard

GET /admin/dashboard

Widgets

Users

Revenue

Vehicles

QR Tags

Notifications

Memberships

Support



API 61

Users

GET /admin/users

Supports

Search

Filters

Sorting

Export



API 62

User Details

GET /admin/users/{userId}



API 63

Update User

PATCH /admin/users/{userId}



API 64

Suspend User

POST /admin/users/{userId}/suspend



API 65

Membership Administration

GET /admin/memberships



API 66

Generate QR Tags

POST /admin/qrtags/generate



Request

{

    "quantity":5000,

    "batchNumber":"2026-01"

}



API 67

QR Inventory

GET /admin/qrtags



Supports

Status

Batch

Inventory

Export



API 68

Reports

GET /admin/reports/revenue



Other Reports

User Growth

QR Activity

Membership Sales

Notifications

Support

Payments



API 69

CMS Pages

GET /admin/cms/pages



API 70

Update CMS

PUT /admin/cms/pages/{pageId}



API 71

Banner Management

GET /admin/banners



POST /admin/banners



PUT /admin/banners/{bannerId}



DELETE /admin/banners/{bannerId}



API 72

FAQ Management

GET /admin/faqs



CRUD Supported



Module 11 – Analytics APIs



API 73

Dashboard Analytics

GET /analytics/dashboard



Returns

Revenue

Growth

Active Users

Notifications

Daily Scans

Conversion



API 74

QR Analytics

GET /analytics/qr



Metrics

Most Scanned Tags

Scan Locations

Scan Frequency

Daily Trends



API 75

Membership Analytics

GET /analytics/memberships



Metrics

Renewal Rate

Churn

Revenue

Growth



Module 12 – Webhooks



Stripe

POST /webhooks/stripe

Events

Payment Success

Refund

Subscription Renewal

Chargeback



Twilio

POST /webhooks/twilio

Events

SMS Delivered

SMS Failed



Email

POST /webhooks/sendgrid

Events

Delivered

Opened

Bounced

Spam



Webhook Rules

Verify provider signatures before processing. 

Ensure idempotency using event identifiers. 

Return HTTP 200 OK only after successful validation and processing (or accepted handling strategy). 

Log all webhook events for auditing and troubleshooting. 



Module 13 – Background Jobs



API 76

Job Status

GET /admin/jobs



Returns

Running Jobs

Completed

Failed

Next Schedule



API 77

Execute Job

POST /admin/jobs/{jobId}/execute



Administrator Only



API 78

Retry Failed Notifications

POST /admin/notifications/retry



API 79

System Health

GET /admin/system-health

Returns

Database

Redis

Queue

Email

SMS

Payment Gateway

Storage

CPU

Memory

Disk



Event Bus

Recommended domain events:

UserRegistered



EmailVerified



VehicleCreated



QrTagActivated



QrTagAssigned



NotificationCreated



NotificationDelivered



MembershipPurchased



PaymentCaptured



OrderCompleted



InvoiceGenerated



SupportTicketCreated



ReferralRewardIssued



Rate Limits

Endpoint

Limit

Login

10/min/IP

QR Scan

100/min/IP

Notification Submission

20/hour/IP

Payment Session

20/hour/user

Admin APIs

300/min/user

Analytics

60/min/user



Authorization Matrix

Module

Customer

Fleet

Support

Finance

Admin

Super Admin

Membership

✔

✔

View

View

✔

✔

Orders

✔

✔

View

✔

✔

✔

Payments

✔

✔

View

✔

✔

✔

Referrals

✔

✔

View

✖

✔

✔

Support

✔

✔

✔

✖

✔

✔

CMS

✖

✖

✖

✖

✔

✔

Reports

✖

Fleet Only

View

✔

✔

✔

Jobs

✖

✖

✖

✖

✔

✔



End of Part 6A

At this point, the REST API specification includes approximately 80 core endpoints, covering:

Authentication & Identity 

User Management 

Vehicle Management 

QR Tag Lifecycle 

Anonymous Notifications 

Memberships & Commerce 

Orders & Payments 

Referrals & Rewards 

Support 

Administration 

Analytics 

Background Jobs 

Webhooks

Part 7 – Information Architecture & User Experience

Version: 1.0

Prepared By: Product Design Team

Design System: Material Design 3 + Custom Brand Components

Responsive Targets: Desktop, Tablet, Mobile



Table of Contents

Design Principles 

Information Architecture 

Sitemap 

User Personas 

User Journeys 

Navigation 

Public Website 

Customer Portal 

Fleet Portal 

Admin Portal 

Design System 

Component Library 

Responsive Behaviour 

Accessibility 

UX Guidelines 



1. Design Philosophy

TRAFFTAG should feel:

Modern 

Fast 

Professional 

Trustworthy 

Privacy Focused 

Minimal 

Mobile First 

Every screen should answer three questions immediately:

Where am I? 

What can I do? 

What should I do next? 



2. Design Principles

Simplicity

Users should complete common tasks in as few steps as practical.

Examples:

Activate QR in under 2 minutes 

Register a vehicle in under 3 minutes 

Send a notification in under 30 seconds 



Privacy by Design

The interface must never expose:

Owner phone number 

Email address 

Physical address 

Membership status 

Internal IDs 



Consistency

Buttons, colors, spacing, typography, dialogs, and icons should behave consistently across all screens.



3. Information Architecture

Public Website

│

├── Home

├── About

├── Pricing

├── Buy Tags

├── How It Works

├── FAQ

├── Contact

├── Login

└── Register



Customer Portal

│

├── Dashboard

├── Vehicles

├── QR Tags

├── Notifications

├── Membership

├── Orders

├── Rewards

├── Support

└── Settings



Fleet Portal

│

├── Fleet Dashboard

├── Vehicles

├── Drivers

├── QR Tags

├── Reports

└── Settings



Admin Portal

│

├── Dashboard

├── Users

├── Vehicles

├── QR Inventory

├── Memberships

├── Orders

├── Payments

├── Notifications

├── Support

├── CMS

├── Reports

└── Settings



4. User Personas

Persona 1 – Individual Vehicle Owner

Goals

Register vehicles 

Activate QR Tags 

Receive alerts 

Protect privacy 

Pain Points

Doesn't want phone number displayed 

Wants instant notifications 

Wants a simple setup 



Persona 2 – Fleet Manager

Goals

Manage hundreds of vehicles 

Assign drivers 

Track QR status 

View reports 



Persona 3 – Administrator

Goals

Manage platform 

Generate QR tags 

Resolve support issues 

Monitor revenue 



5. Primary User Journey

Vehicle Owner Journey

Landing Page

      │

      ▼

Register

      │

      ▼

Verify Email

      │

      ▼

Login

      │

      ▼

Dashboard

      │

      ▼

Register Vehicle

      │

      ▼

Activate QR

      │

      ▼

Attach QR Sticker

      │

      ▼

Receive Notifications



6. Navigation Structure

Desktop Navigation

LOGO



Home

Pricing

Buy Tags

How It Works

FAQ

Contact



Login

Register

After login

Dashboard



Vehicles



QR Tags



Membership



Notifications



Rewards



Support



Profile



7. Public Website



Home Page

Purpose

Introduce TRAFFTAG and convert visitors into customers.



Hero Section

Contains

Logo

Headline

Subheading

Primary CTA

Secondary CTA

Background Illustration

Example

Protect Your Privacy.



Help Others Reach You Without Sharing Your Phone Number.



[Buy Your QR Tag]



[Learn More]



Features Section

Cards

Privacy

QR Technology

Instant Alerts

No Mobile App Required



How It Works

Illustrated steps

1

Buy Tag

↓

2

Register Vehicle

↓

3

Stick QR

↓

4

Receive Notifications



Testimonials

Customer reviews

Ratings

Photos (optional)



Pricing

Membership comparison cards



Footer

Links

Privacy

Terms

Contact

Social Media



8. Login Screen

Components

Email

Password

Remember Me

Forgot Password

Login Button

Register Link



Validation

Required fields

Valid email

Friendly errors

Loading indicator



9. Registration Screen

Fields

First Name

Last Name

Email

Phone

Password

Confirm Password

Referral Code

Accept Terms

Register Button



Validation

Real-time validation

Password strength meter

Duplicate email check



10. Customer Dashboard

Purpose

Central hub after login.



Widgets

Welcome Card

Membership Status

Vehicle Count

Active QR Tags

Unread Notifications

Orders

Rewards

Quick Actions



Quick Actions

Register Vehicle

Activate QR

Purchase Membership

View Notifications

Contact Support



Dashboard Layout

+----------------------------------------+

| Welcome                               |

+----------------------------------------+



+------------+------------+-------------+

| Vehicles   | QR Tags    | Membership  |

+------------+------------+-------------+



+------------+------------+-------------+

| Notifications | Rewards | Orders      |

+------------+------------+-------------+



Quick Actions



Recent Notifications



Recent Orders



11. Vehicle Screen

Table

Vehicle Image

Nickname

Plate

QR Status

Membership

Actions



Actions

View

Edit

Archive

Replace QR

History



Button

+ Add Vehicle



12. Vehicle Registration Wizard

Step 1

Vehicle Details

↓

Step 2

Images

↓

Step 3

Documents

↓

Step 4

Assign QR

↓

Complete

Progress indicator should always be visible.



13. QR Tag Screen

Shows

QR Image

Serial Number

Status

Activation Date

Vehicle

Scan Count

Notification Count



Buttons

Activate

Replace

Transfer

Download QR (if allowed)

Print QR Instructions



14. Notifications Screen

List View

Category

Vehicle

Message Preview

Priority

Date

Status



Filters

Vehicle

Category

Priority

Read

Date

Search



Click

↓

Full Notification



Notification Detail

Vehicle

Category

Date

Message

Delivery Channels

Attachments

Read Status



15. Membership Screen

Displays

Current Plan

Benefits

Renewal Date

Auto Renew Status

Usage Limits



Actions

Upgrade

Renew

Cancel Auto Renew

View Invoice



16. Rewards Screen

Shows

Current Reward Balance

Recent Transactions

Referral Link

Share Buttons

Progress to Next Reward Tier (if applicable)



17. Support Screen

Tabs

Open Tickets

Closed Tickets

Knowledge Base

Create Ticket



Create Ticket

Subject

Category

Priority

Description

Attachments

Submit



18. Settings Screen

Sections

Profile

Security

Notifications

Addresses

Vehicles

Language

Privacy

Sessions

Delete Account



Responsive Behaviour

Desktop

Sidebar

Large tables

Multiple panels



Tablet

Collapsible sidebar

Cards

Responsive tables



Mobile

Bottom Navigation

Cards

Single-column layout

Floating Action Button for primary actions



Accessibility Requirements

WCAG 2.1 AA compliance target 

Keyboard navigation throughout 

Visible focus indicators 

Semantic HTML landmarks 

ARIA labels for interactive controls 

Color contrast ratio meeting accessibility standards 

Screen reader compatibility 

Error messages associated with their corresponding inputs 



UX Guidelines

Display skeleton loaders for data-fetching screens. 

Use optimistic UI updates only where safe. 

Confirm destructive actions (archive vehicle, replace QR, delete account). 

Persist draft data for multi-step forms where feasible. 

Provide clear success and error feedback after every significant action. 

Keep critical actions (Activate QR, Register Vehicle, Buy Membership) visible and easy to discover. 



End of Part 7 – Section 1

This section establishes the overall information architecture, navigation, primary user flows, and foundational screen specifications for the TRAFFTAG platform.

Part 7A – Complete Screen-by-Screen UI Specification

Version: 1.0

Design Framework: Material Design 3

Responsive Grid: 12 Column

Target Platforms:

Desktop 

Tablet 

Mobile 

Progressive Web App (Future) 



Screen Index

Public Website

Home 

Pricing 

Buy QR Tags 

How It Works 

FAQ 

Contact 

About 



Customer Portal

Login 

Register 

Forgot Password 

Dashboard 

Vehicle List 

Add Vehicle 

Vehicle Details 

QR Management 

Notifications 

Membership 

Orders 

Rewards 

Support 

Profile 

Settings 



Fleet Portal

Fleet Dashboard 

Fleet Vehicles 

Drivers 

Fleet Reports 



Admin Portal

Dashboard 

User Management 

QR Inventory 

Orders 

Payments 

CMS 

Reports 

Settings 



Screen 1 — Home Page

Purpose

Introduce TRAFFTAG, establish trust, explain the product, and encourage visitors to purchase QR tags or create an account.



Layout

---------------------------------------------------------

LOGO                MENU                    LOGIN REGISTER

---------------------------------------------------------



Hero Banner



Headline



Subtitle



[ Buy Your Tag ]



[ Learn More ]



---------------------------------------------------------



How TRAFFTAG Works



1



Buy



↓



2



Register



↓



3



Attach QR



↓



4



Receive Alerts



---------------------------------------------------------



Features



Privacy



QR Technology



Instant Alerts



No App Required



---------------------------------------------------------



Testimonials



---------------------------------------------------------



Membership Plans



---------------------------------------------------------



FAQ



---------------------------------------------------------



Footer



Components

Navigation Bar

Contains

Logo 

Home 

Pricing 

Buy Tags 

FAQ 

Contact 

Login 

Register 

Sticky on scroll.



Hero Banner

Large illustration.

Headline.

CTA Button.

Secondary CTA.



Feature Cards

Each card contains

Icon

Title

Description

Hover animation



CTA Buttons

Primary

Filled

Secondary

Outlined



Responsive

Desktop

Four feature cards per row.

Tablet

Two per row.

Mobile

Single column.



Screen 2 — Login

Purpose

Authenticate users.



Layout

---------------------



Welcome Back



Email



Password



Remember Me



Forgot Password



LOGIN



Create Account



---------------------



Components

Email Textbox

Password Textbox

Remember Me Checkbox

Login Button

Forgot Password Link

Register Link



Validation

Email required.

Password required.

Email format.

Display inline validation messages.



Error State

Incorrect password.

Account locked.

Account disabled.

Email not verified.



Success

Redirect to Dashboard.



Screen 3 — Register



Layout

--------------------



First Name



Last Name



Email



Phone



Password



Confirm Password



Referral Code



Accept Terms



REGISTER



--------------------



Components

Password Strength Meter

Country Code Picker

Terms Checkbox

Referral Tooltip



Validation

Live validation.

Email uniqueness check.

Password policy check.

Phone format.



Screen 4 — Dashboard



Purpose

Provide a personalized overview of the user's account and quick access to common actions.



Layout

---------------------------------------------------



Sidebar



Dashboard



---------------------------------------------------



Welcome Card



---------------------------------------------------



Quick Actions



+ Vehicle



Activate QR



Membership



Support



---------------------------------------------------



Cards



Vehicles



QR Tags



Notifications



Rewards



Orders



---------------------------------------------------



Charts



Notification Trend



QR Scan Trend



---------------------------------------------------



Recent Notifications



---------------------------------------------------



Recent Orders



---------------------------------------------------



Dashboard Widgets

Welcome

Customer Name

Membership

Last Login



Vehicle Card

Vehicle Count

Button

View All



QR Card

Active

Inactive

Replacement Needed



Membership

Current Plan

Expiry

Renew Button



Rewards

Wallet

Pending

Referral Link



Notifications

Unread

Today's

Weekly



Empty State

No Vehicle

Illustration

Text

Register your first vehicle.

Button

Add Vehicle



Loading State

Skeleton cards.



Screen 5 — Vehicle List



Purpose

Manage all registered vehicles.



Toolbar

Search

Filter

Export

Add Vehicle



Table

Vehicle Image

Nickname

Plate

QR

Status

Actions



Actions

View

Edit

Archive

Replace QR

History



Mobile

Cards instead of table.



Screen 6 — Vehicle Details



Sections

Vehicle

QR

Images

Documents

Preferences

History



Tabs

Overview

QR

Notifications

Documents

History



Actions

Edit

Replace QR

Transfer QR

Archive



Screen 7 — Vehicle Wizard



Step 1

Vehicle Details



Step 2

Images

Drag & Drop Upload



Step 3

Documents

Upload

Preview



Step 4

Activate QR

Scan QR

OR

Enter Serial



Step 5

Confirmation

Vehicle Created



Progress Bar

Always Visible



Screen 8 — QR Management



Shows

QR Image

Status

Vehicle

Serial Number

Activation Date

Scan Count

Notification Count



Buttons

Replace

Transfer

Print Instructions



Screen 9 — Notifications



Toolbar

Search

Date

Priority

Vehicle

Read

Unread



List

Priority Icon

Category

Preview

Vehicle

Time

Read Status



Click

↓

Details



Details

Message

Vehicle

Delivery Status

Attachments

Read Time



Screen 10 — Membership



Cards

Current Plan

Benefits

Usage

Renew

Upgrade



History

Invoices

Payments

Renewals



Screen 11 — Rewards



Widgets

Reward Wallet

Lifetime Earnings

Pending Rewards

Referral Link



Buttons

Share

Copy Link

View Transactions



Charts

Monthly Rewards



Screen 12 — Orders



Table

Order

Date

Items

Amount

Status

Invoice



Actions

Download Invoice

Track Shipment

Cancel (if eligible)



Screen 13 — Support



Tabs

Open

Closed

Knowledge Base



Create Ticket

Category

Priority

Subject

Description

Attachments



Conversation

Chat-style interface.

Internal notes hidden from customers.



Screen 14 — Profile



Sections

Personal Information

Security

Addresses

Emergency Contact

Language

Sessions



Actions

Save

Change Password

Delete Account



Screen 15 — Settings



Categories

Notifications

Privacy

Appearance (Future)

Language

Time Zone

Marketing Preferences

Connected Devices

API Access (Future)



Common UI Components

Buttons

Primary 

Secondary 

Danger 

Ghost 

Icon 

Floating Action Button 



Inputs

Text 

Password 

Email 

Phone 

Date Picker 

Time Picker 

Dropdown 

Autocomplete 

Multi-select 

Toggle Switch 

Checkbox 

Radio Button 

File Upload 



Feedback Components

Toast Notifications 

Snackbar 

Modal Dialog 

Confirmation Dialog 

Progress Bar 

Skeleton Loader 

Empty State Card 

Error Banner 



Responsive Breakpoints

Device

Width

Mobile

<768px

Tablet

768–1023px

Desktop

1024–1439px

Large Desktop

≥1440px



UX Guidelines

Primary action should be visually dominant on every page. 

Display confirmation dialogs for irreversible actions (e.g., archive vehicle, replace QR, delete account). 

Preserve form data during accidental navigation when practical. 

Provide contextual help and tooltips for complex workflows. 

Use consistent iconography and terminology across the platform. 

Ensure loading indicators appear for operations expected to take more than 300 ms. 

Provide clear success, warning, and error messages with actionable guidance. 



End of Part 7A – Section 1

This section defines the complete public website and customer portal experience, including screen layouts, navigation, forms, components, validation, responsive behavior, and interaction standards.

Part 7A – Section 2

Fleet Portal & Administration Portal

Version: 1.0



Fleet Portal Overview

The Fleet Portal is designed for organizations managing multiple vehicles, drivers, and QR tags from a single dashboard.

Target Users

Fleet Manager 

Company Administrator 

Operations Manager 

Logistics Coordinator 



Fleet Navigation

----------------------------------------------------

LOGO



Dashboard

Vehicles

Drivers

QR Tags

Notifications

Reports

Settings



Profile

Logout

----------------------------------------------------



Screen 16 — Fleet Dashboard

Purpose

Provide a centralized operational overview of the fleet.



Layout

+---------------------------------------------------------+



Fleet Dashboard



----------------------------------------------------------



Vehicle Summary



Active Vehicles



Inactive Vehicles



Vehicles Due for Renewal



----------------------------------------------------------



QR Tag Summary



Activated



Pending Activation



Replacement Required



----------------------------------------------------------



Notifications



Unread



Today's Alerts



Critical Alerts



----------------------------------------------------------



Driver Summary



Active Drivers



Unassigned Drivers



Expiring Licenses



----------------------------------------------------------



Fleet Activity Chart



----------------------------------------------------------



Quick Actions



+ Add Vehicle



Assign Driver



Generate Report



Activate QR



----------------------------------------------------------



Recent Activity



----------------------------------------------------------



Dashboard Widgets

Fleet Overview

Displays

Total Vehicles 

Active Vehicles 

Archived Vehicles 

Vehicles Without QR 



Driver Overview

Displays

Assigned Drivers 

Available Drivers 

Driver License Expiry 

Suspended Drivers 



QR Statistics

Displays

Active QR Tags 

Unassigned QR Tags 

Replacement Requests 

Today's QR Scans 



Notifications

Displays

High Priority Alerts 

Unread Notifications 

Today's Messages 



Charts

Vehicle Registration Trend

QR Scan Trend

Monthly Notifications

Fleet Growth



Screen 17 — Fleet Vehicle Management



Toolbar

Search

Vehicle Status

Driver Filter

Export Excel

Export PDF

Bulk Actions

Add Vehicle



Table

Column

Vehicle Image

License Plate

Driver

QR Status

Registration Expiry

Insurance Expiry

Membership

Actions



Actions

View

Edit

Assign Driver

Activate QR

Transfer QR

Archive



Bulk Actions

Assign QR

Archive

Export

Assign Membership



Screen 18 — Driver Management



Purpose

Manage fleet drivers.



Toolbar

Search

Status

Add Driver

Export



Driver Table

Driver Name

Phone

License Number

License Expiry

Assigned Vehicle

Status



Driver Profile

Personal Information

License Information

Assigned Vehicles

Incident History

Documents



Driver Actions

Assign Vehicle

Unassign

Suspend

Delete



Screen 19 — Fleet QR Management



Dashboard

Displays

Available Tags

Assigned Tags

Lost Tags

Damaged Tags



Table

Serial Number

Vehicle

Driver

Activation

Status

Last Scan



Actions

Assign

Replace

Transfer

Deactivate



Screen 20 — Fleet Reports



Available Reports

Vehicle Utilization

Driver Activity

Notification History

QR Activity

Membership Report

Maintenance Due

Insurance Expiry

Registration Expiry



Filters

Date

Vehicle

Driver

Location

QR Status



Export

Excel

CSV

PDF



Screen 21 — Fleet Settings



Tabs

Company Profile

Notification Preferences

Default Language

Working Hours

Vehicle Categories

Roles & Permissions

Billing



Administration Portal



Navigation

Dashboard



Users



Vehicles



Fleet



QR Inventory



Membership



Orders



Payments



Notifications



Support



CMS



Reports



Settings



Audit Logs



Logout



Screen 22 — Admin Dashboard



Layout

------------------------------------------------------------



Dashboard



------------------------------------------------------------



Users



Vehicles



QR Tags



Memberships



Revenue



------------------------------------------------------------



Charts



Daily Users



Revenue



Notifications



Orders



------------------------------------------------------------



System Health



Database



Redis



Queue



Storage



Email



SMS



------------------------------------------------------------



Latest Activities



------------------------------------------------------------



Pending Tasks



------------------------------------------------------------



KPI Cards

Total Users

Active Users

Vehicles

QR Tags

Membership Revenue

Orders Today

Support Tickets

Notifications Today



Charts

Daily Registrations

Monthly Revenue

QR Activations

Membership Sales

Notification Trends

Support Trends



Quick Actions

Generate QR Tags

Create Membership Plan

Publish Banner

Create CMS Page

View Reports



Screen 23 — User Management



Toolbar

Search

Membership

Status

Role

Export

Import



Table

User

Email

Phone

Membership

Vehicles

QR Tags

Status

Actions



Actions

View

Edit

Suspend

Activate

Reset Password

Delete

Assign Role



User Detail

Personal Information

Vehicles

Membership

Payments

Support

Notifications

Audit Log



Screen 24 — QR Inventory



Dashboard

Manufactured

Available

Assigned

Lost

Damaged

Archived



Table

Serial

Batch

Status

Vehicle

Activation

Last Scan



Actions

Generate

Assign

Replace

Archive

Export



Screen 25 — Membership Administration



Membership Plans

Benefits

Pricing

Discounts

Coupons

Renewals



Actions

Create

Edit

Deactivate

Duplicate

Archive



Screen 26 — Payment Management



Table

Invoice

Order

Customer

Gateway

Amount

Status

Date



Actions

View

Refund

Export

Invoice PDF



Charts

Revenue

Refunds

Payment Success

Gateway Performance



Screen 27 — Notification Administration



Statistics

Queued

Delivered

Failed

Retry



Table

Notification

Vehicle

Owner

Priority

Status

Delivery

Created



Actions

View

Retry

Archive

Delete



Screen 28 — Support Administration



Dashboard

Open

Pending

Resolved

Escalated



Queue

Ticket

Customer

Priority

Assigned

Status

Age



Actions

Assign

Reply

Escalate

Close

Merge



Screen 29 — CMS



Pages

Blogs

Banners

FAQs

Media



Editor

Rich Text

Markdown

Image Upload

SEO

Preview

Publish

Version History



Screen 30 — Reports



Categories

Revenue

Membership

QR Activity

Notifications

Support

Fleet

Users

Payments

System



Features

Charts

Pivot Tables

Drill-down

Export

Scheduling



Screen 31 — Audit Logs



Filters

Date

User

Module

Action

Severity



Table

Timestamp

User

Module

Action

IP

Browser

Status



Actions

View Details

Export



Screen 32 — System Settings



Sections

General

Email

SMS

Payments

Security

Storage

Background Jobs

Integrations

API Keys

Maintenance Mode



Common Admin Components

Tables

Server-side pagination 

Multi-column sorting 

Advanced filtering 

Saved views 

Column visibility selection 

Bulk actions 

Export options 



Charts

Line Charts 

Bar Charts 

Pie Charts 

Donut Charts 

Area Charts 

Heat Maps 

Geographic Maps 



Forms

Auto-save drafts 

Unsaved changes warning 

Input validation 

File uploads 

Rich text editor 

Date/time pickers 



Notifications

Success toast 

Warning banner 

Error dialog 

Confirmation modal 

Long-running task progress indicator 



Responsive Design

Desktop (Primary)

Full sidebar 

Multi-column layouts 

Data tables 

Dashboard grids 

Tablet

Collapsible sidebar 

Two-column layouts 

Compact tables 

Mobile (Limited Administrative Access)

Card-based layouts 

Bottom navigation where appropriate 

Essential actions only 

Read-only dashboards for some administrative modules 



UX Standards for Admin Portal

Dashboard should load within 2 seconds under normal conditions. 

All destructive actions require confirmation. 

Bulk operations must display progress and results. 

Export operations should execute asynchronously for large datasets. 

Long-running reports should notify users upon completion. 

All administrative actions should generate audit log entries. 



End of Part 7A – Section 2

At this point, the UI specification includes:

✅ Public Website 

✅ Authentication Screens 

✅ Customer Portal 

✅ Fleet Portal 

✅ Administration Portal 

✅ Navigation 

✅ Screen Layouts 

✅ Responsive Behaviour 

✅ UX Standards

Part 7B – Design System & UI Standards

Version: 1.0

Design Language: Material Design 3 + TRAFFTAG Custom Components

Platforms Supported

Web 

Mobile 

Tablet 

Admin Portal 

Fleet Portal 



Table of Contents

Brand Identity 

Logo Guidelines 

Color System 

Typography 

Spacing System 

Grid System 

Elevation 

Border Radius 

Icons 

Buttons 

Form Controls 

Cards 

Tables 

Navigation 

Charts 

Notifications 

Loading States 

Motion System 

Dark Theme 

Accessibility 



1. Brand Identity

TRAFFTAG represents:

Privacy 

Safety 

Trust 

Modern Technology 

Reliability 

The interface should communicate confidence without feeling complex.



Brand Personality

Attribute

Description

Modern

Clean, contemporary UI

Secure

Professional appearance

Friendly

Easy to understand

Reliable

Stable and consistent

Premium

High-quality visual finish



Logo Guidelines

Primary Logo

TRAFFTAG

Used on:

Website 

Dashboard 

Login 

Mobile App 



Icon

Rounded QR Symbol

↓

Shield

↓

Vehicle



Minimum Size

24px

Preferred

40px



Spacing

Minimum clear space

0.5 × logo height



Never

Stretch 

Rotate 

Add shadows 

Change colors 

Place on low-contrast backgrounds 



2. Color System

Primary

Name

Hex

Primary

#1565C0

Purpose

Primary buttons

Navigation

Links

Highlights



Secondary

Name

Hex

Secondary

#00897B

Used for

Success

QR

Positive status



Accent

Name

Hex

Accent

#FF9800

Used for

Warnings

Pending actions



Semantic Colors

Success

#2E7D32



Error

#D32F2F



Warning

#F9A825



Info

#0288D1



Neutral Scale

Level

Color

50

#FAFAFA

100

#F5F5F5

200

#EEEEEE

300

#E0E0E0

400

#BDBDBD

500

#9E9E9E

600

#757575

700

#616161

800

#424242

900

#212121



Usage Rules

Primary

Main Action

Secondary

Secondary Action

Danger

Delete

Warning

Attention

Success

Completed



3. Typography

Font Family

Inter

Fallback

Roboto



Segoe UI



Arial



Font Scale

Style

Size

Weight

Display Large

57px

700

Display Medium

45px

700

H1

40px

700

H2

32px

700

H3

28px

600

H4

24px

600

H5

20px

600

H6

18px

600

Body Large

16px

400

Body

14px

400

Caption

12px

400



Text Colors

Primary

#212121

Secondary

#616161

Disabled

#9E9E9E

Inverse

White



4. Spacing System

Use an 8px base grid.

Token

Value

XS

4px

SM

8px

MD

16px

LG

24px

XL

32px

XXL

48px

XXXL

64px

Rules

Never use arbitrary spacing.

Everything aligns to the 8px grid.



5. Grid System

Desktop

12 Columns

Gutter

24px

Margin

32px



Tablet

8 Columns



Mobile

4 Columns



Maximum Content Width

1440px



6. Elevation

Cards

2dp

Dialogs

8dp

Floating Buttons

6dp

Navigation

4dp

Hover

+2dp



7. Border Radius

Buttons

8px

Cards

12px

Dialogs

16px

Inputs

8px

Images

12px

Pills

999px



8. Iconography

Library

Material Symbols

Supported Sizes

16

20

24

32

48



Examples

Vehicle

QR

Notification

Settings

Support

Membership

Payment

Dashboard



Rules

Filled

For selected state

Outlined

Default

Rounded

Preferred



9. Button Library

Primary Button

Background

Primary Blue

Text

White

Height

48px

Radius

8px



Secondary Button

Outlined

Blue Border

White Background



Danger Button

Red

Used for

Delete

Archive

Suspend



Ghost Button

Transparent

Text only



Icon Button

Square

40 × 40



States

Default

Hover

Focus

Pressed

Disabled

Loading



10. Form Controls

Text Field

Height

48px

Radius

8px

Label above input

Inline validation

Character counter when applicable



Dropdown

Searchable

Keyboard accessible

Clear selection option



Date Picker

Calendar popup

Keyboard navigation



File Upload

Drag & Drop

Preview

Progress Bar

Retry support



Validation States

Normal

Focused

Success

Warning

Error

Disabled



11. Card Components

Card Types

Information

Statistics

Vehicle

Membership

Notification

Support

Chart

Pricing



Standard Card

Header

Body

Footer (optional)

Actions



12. Data Tables

Features

Sticky Header

Sorting

Filtering

Pagination

Row Selection

Column Visibility

Export

Responsive Collapse



States

Loading

Empty

Error

No Results



13. Navigation

Top Navigation

Public Website



Sidebar

Customer Portal

Fleet Portal

Admin Portal



Bottom Navigation

Mobile



Breadcrumbs

All Admin Screens



14. Charts

Supported Types

Line

Bar

Pie

Donut

Area

Heat Map

Geo Map



Chart Rules

Legend always visible

Export option

Accessible colors

Tooltip on hover



15. Notifications

Toast

Short confirmation

Snackbar

Undo actions

Modal

Critical confirmation

Banner

System alerts



Severity

Success

Warning

Error

Information



16. Loading States

Use Skeleton Screens

Never show empty white pages during loading



Examples

Cards

Tables

Charts

Forms

Vehicle Images



17. Empty States

Every screen should include:

Illustration

Title

Helpful description

Primary action

Example

No Vehicles Yet



Register your first vehicle to activate your QR tag.



[ Add Vehicle ]



18. Motion System

Animations should feel fast and subtle.

Page transition

200 ms

Hover

120 ms

Dialog

180 ms

Drawer

250 ms

Toast

300 ms



Avoid excessive animations.

Respect users who prefer reduced motion.



19. Dark Theme

Supported across:

Customer Portal 

Fleet Portal 

Admin Portal 

Color tokens should be defined separately from hard-coded values to enable easy theme switching.



20. Accessibility

Target

WCAG 2.1 AA

Requirements

Keyboard navigation 

Visible focus indicators 

Screen reader labels 

Semantic HTML 

Minimum contrast ratio of 4.5:1 for normal text 

Error messages linked to inputs 

Accessible charts with textual summaries where appropriate 



Design Tokens (Developer Reference)

These tokens should be shared between Figma and the frontend implementation.

color.primary = #1565C0

color.secondary = #00897B

color.success = #2E7D32

color.warning = #F9A825

color.error = #D32F2F



spacing.xs = 4

spacing.sm = 8

spacing.md = 16

spacing.lg = 24

spacing.xl = 32



radius.sm = 8

radius.md = 12

radius.lg = 16



font.family = Inter

font.body = 14

font.heading = 32



Component Inventory

The initial component library should include:

Category

Components

Navigation

App Bar, Sidebar, Breadcrumbs, Tabs, Pagination

Inputs

Text Field, Password, Select, Date Picker, Upload, Checkbox, Radio, Switch

Feedback

Snackbar, Toast, Alert, Dialog, Progress, Skeleton

Data Display

Cards, Tables, Chips, Badges, Avatars, Tooltips

Actions

Buttons, Icon Buttons, Floating Action Button, Menus

Charts

Line, Bar, Pie, Donut, Area, KPI Cards

Layout

Container, Grid, Accordion, Drawer, Modal



End of Part 7B – Design System

The TRAFFTAG Design System now defines the visual language and reusable UI components that will be shared across the public website, customer portal, fleet portal, and administration portal.

Software Architecture & Technical Design

Part 8 – System Architecture

Version: 1.0

Architecture Pattern

Clean Architecture 

Domain Driven Design (DDD) 

SOLID Principles 

CQRS (Selective) 

Repository Pattern 

Event Driven Architecture 

REST API 

Cloud Native Ready 



Table of Contents

Architecture Overview 

High-Level System Architecture 

Clean Architecture 

Project Structure 

Domain Driven Design 

Authentication Architecture 

Authorization Architecture 

Application Layer 

Infrastructure Layer 

Persistence Layer 

Event Driven Architecture 

Background Processing 

Caching Strategy 

File Storage 

Notification Service 

Payment Architecture 

Security Architecture 

Logging & Monitoring 

CI/CD Pipeline 

Deployment Architecture 



1. Architecture Goals

TRAFFTAG must support:

Millions of users 

Millions of QR tags 

High availability 

Multi-region deployment 

Horizontal scaling 

Zero downtime deployment 

Enterprise security 

Easy maintenance 

Cloud portability 



2. High-Level System Architecture

                    Internet

                         │

              Cloud Load Balancer

                         │

          ┌──────────────┴──────────────┐

          ▼                             ▼

   Web Application                 Mobile Apps

      (React)                    (iOS / Android)

          │                             │

          └──────────────┬──────────────┘

                         ▼

                    API Gateway

                         │

        ┌────────────────┼────────────────┐

        ▼                ▼                ▼

 Authentication     Application API   Admin API

        │                │                │

        └────────────────┼────────────────┘

                         ▼

                  Application Layer

                         │

      ┌──────────────────┼──────────────────┐

      ▼                  ▼                  ▼

 Domain Layer     Infrastructure      Background Jobs

      │                  │                  │

      └──────────────────┼──────────────────┘

                         ▼

               SQL Server Database

                         │

      ┌──────────────┬──────────────┬──────────────┐

      ▼              ▼              ▼

     Redis      Object Storage   Message Queue



Technology Stack

Frontend

Component

Technology

Web

React 19

State Management

Redux Toolkit

Routing

React Router

UI

Material UI

Forms

React Hook Form

Validation

Zod

Charts

Apache ECharts

HTTP Client

Axios or Fetch Wrapper



Backend

Component

Technology

Framework

ASP.NET Core 8

Language

C# 12

ORM

Entity Framework Core 8

Database

SQL Server 2022

Authentication

JWT

Background Jobs

Hangfire

Validation

FluentValidation

Logging

Serilog

Object Mapping

AutoMapper



Infrastructure

Service

Technology

Reverse Proxy

Nginx

CDN

CloudFront / Azure CDN

Cache

Redis

Object Storage

Amazon S3 / Azure Blob Storage

Monitoring

Prometheus + Grafana

Logs

ELK Stack

Queue

RabbitMQ / Azure Service Bus

Container

Docker

Orchestration

Kubernetes



3. Clean Architecture

+------------------------------------------------------+

|                  Presentation Layer                  |

|         (React, Mobile Apps, Admin Portal)          |

+------------------------------------------------------+



+------------------------------------------------------+

|                  API Layer                          |

|             ASP.NET Core Controllers                |

+------------------------------------------------------+



+------------------------------------------------------+

|              Application Layer                      |

| Commands | Queries | Services | DTOs               |

+------------------------------------------------------+



+------------------------------------------------------+

|                 Domain Layer                        |

| Entities | Aggregates | Value Objects              |

| Domain Events | Interfaces | Business Rules        |

+------------------------------------------------------+



+------------------------------------------------------+

|             Infrastructure Layer                    |

| EF Core | Redis | SMTP | Storage | Payment         |

+------------------------------------------------------+



+------------------------------------------------------+

|                SQL Server Database                  |

+------------------------------------------------------+



Dependency Rule

Dependencies flow inward only.

Presentation

      │

      ▼

Application

      │

      ▼

Domain

The Domain layer must not reference:

Entity Framework 

ASP.NET Core 

SQL Server 

Redis 

Third-party SDKs 



4. Solution Structure

TraffTag.sln



/src



TraffTag.Api



TraffTag.Application



TraffTag.Domain



TraffTag.Infrastructure



TraffTag.Persistence



TraffTag.Contracts



TraffTag.SharedKernel



TraffTag.Worker



/tests



TraffTag.UnitTests



TraffTag.IntegrationTests



TraffTag.PerformanceTests



/docs



Database



Architecture



API



5. Domain Driven Design

Bounded Contexts

Authentication



Users



Vehicles



QR Tags



Notifications



Membership



Orders



Payments



Support



CMS



Analytics

Each bounded context owns:

Entities 

Business rules 

Repositories 

Domain events 

Value objects 



Aggregate Example

Vehicle

│

├── QR Assignment

├── Images

├── Documents

├── Preferences

└── Notification History

Vehicle is the Aggregate Root.



6. Entity Lifecycle

Example

Vehicle

Create



↓



Validate



↓



Persist



↓



Publish Event



↓



Cache



↓



Notify



7. CQRS Strategy

CQRS is applied selectively.

Commands

Register Vehicle 

Purchase Membership 

Create Notification 

Activate QR 

Replace QR 

Queries

Dashboard 

Reports 

Vehicle List 

Notifications 

Membership Summary 



Command Flow

Controller



↓



Validator



↓



Command



↓



Handler



↓



Repository



↓



Database



↓



Domain Event



↓



Response



Query Flow

Controller



↓



Query



↓



Handler



↓



Read Database



↓



DTO



↓



Response



8. Repository Pattern

Example

IVehicleRepository



Add()



Update()



Archive()



GetById()



Search()



ExistsByVIN()

Repositories expose domain-oriented operations rather than generic CRUD where business behavior is important.



9. Unit of Work

One transaction

↓

Multiple repositories

↓

Commit

↓

Rollback on failure



Example

Purchase Membership

↓

Membership Repository

↓

Order Repository

↓

Payment Repository

↓

Invoice Repository

↓

Commit



10. Dependency Injection

Every service registered using ASP.NET Core DI.

Examples

IVehicleService



INotificationService



IPaymentService



IStorageService



IEmailService



ISMSService



IQrService



IUserService



11. Validation Pipeline

Request

↓

FluentValidation

↓

Application Layer

↓

Business Rules

↓

Database

↓

Response

Validation is performed before business logic whenever possible.



12. Object Mapping

AutoMapper (or equivalent mapping strategy) should be used for simple DTO-to-entity mappings.

Examples

VehicleDTO



↓



Vehicle Entity



↓



VehicleResponseDTO

Complex mappings that contain business logic should be handled explicitly rather than hidden inside mapping profiles.



13. Domain Events

Examples

UserRegistered



VehicleCreated



QrTagActivated



MembershipPurchased



PaymentCaptured



NotificationCreated



SupportTicketOpened

Domain events enable loose coupling between modules.



14. Application Services

Core services include:

Authentication Service 

Vehicle Service 

QR Service 

Membership Service 

Payment Service 

Notification Service 

Referral Service 

Reporting Service 

Support Service 

CMS Service 

Each service should expose interfaces in the Application layer and implementations in Infrastructure where external dependencies exist.



15. Architectural Principles

Keep business rules inside the Domain layer. 

Keep controllers thin; they orchestrate requests rather than implement business logic. 

Prefer asynchronous I/O for database, storage, and network operations. 

Separate read models from write models where performance or complexity justifies it. 

Publish events instead of tightly coupling modules. 

Favor composition over inheritance. 

Ensure all public APIs are documented and versioned. 



End of Part 8 – Section 1

This section establishes the foundational architecture of the TRAFFTAG platform, including Clean Architecture, Domain-Driven Design, project structure, dependency management, CQRS, repositories, and application layering.

Part 8A – Infrastructure, Security & Cloud Architecture

Version: 1.0

Target Cloud Platforms

AWS 

Microsoft Azure 

On-Premises (Enterprise) 



Table of Contents

Infrastructure Overview 

Cloud Architecture 

Authentication Architecture 

Authorization 

API Gateway 

Redis Caching 

Message Queue 

Background Processing 

Object Storage 

CDN 

Payment Infrastructure 

Email & SMS 

Logging 

Monitoring 

Security 

Disaster Recovery 

High Availability 

CI/CD 

Kubernetes 

Secrets Management 



1. Infrastructure Overview

The platform follows a distributed architecture with independent application instances behind a load balancer.

                   Internet

                       │

             Cloud Load Balancer

                       │

      ┌────────────────┴────────────────┐

      ▼                                 ▼

 Application Instance 1         Application Instance 2

      │                                 │

      └────────────────┬────────────────┘

                       ▼

                  API Gateway

                       │

       ┌───────────────┼────────────────┐

       ▼               ▼                ▼

 Authentication   Business APIs    Admin APIs

                       │

      ┌────────────────┼────────────────┐

      ▼                ▼                ▼

 Redis Cache      RabbitMQ Queue   Hangfire Server

      │                │                │

      └────────────────┼────────────────┘

                       ▼

                  SQL Server Cluster

                       │

      ┌───────────────┼───────────────┐

      ▼               ▼               ▼

  Object Storage    Monitoring     Logging



2. Cloud Architecture

AWS Deployment

Layer

AWS Service

DNS

Route 53

CDN

CloudFront

Load Balancer

Application Load Balancer

Compute

Amazon ECS or EKS

Database

Amazon RDS for SQL Server

Cache

Amazon ElastiCache (Redis)

Storage

Amazon S3

Queue

Amazon SQS or Amazon MQ (RabbitMQ-compatible)

Secrets

AWS Secrets Manager

Monitoring

CloudWatch + Prometheus + Grafana



Azure Deployment

Layer

Azure Service

DNS

Azure DNS

CDN

Azure Front Door / Azure CDN

Compute

Azure Kubernetes Service (AKS)

Database

Azure SQL Managed Instance

Cache

Azure Cache for Redis

Storage

Azure Blob Storage

Queue

Azure Service Bus

Secrets

Azure Key Vault

Monitoring

Azure Monitor + Application Insights



3. Authentication Architecture

Authentication uses:

JWT Access Tokens 

Refresh Tokens 

Secure Password Hashing 

Multi-Factor Authentication (MFA) 

Device Tracking 



Login Flow

User Login

      │

      ▼

Validate Credentials

      │

      ▼

Generate JWT

      │

      ▼

Generate Refresh Token

      │

      ▼

Store Refresh Token

      │

      ▼

Return Tokens



JWT Claims

Claim

Description

sub

User ID

email

User Email

name

Full Name

roles

Assigned Roles

permissions

Effective Permissions (optional)

tenantId

Future multi-tenant support

exp

Expiration

iat

Issued At



Token Lifetime

Token

Lifetime

Access Token

15–30 minutes

Refresh Token

30–90 days



Refresh Token Rotation

Every refresh request:

Old Token

↓

Invalidate

↓

Generate New Token

↓

Store New Token

↓

Return New Tokens



4. Authorization

Supports:

Role-Based Access Control (RBAC) 

Policy-Based Authorization 

Resource Ownership Checks 



Roles

Customer

Fleet Manager

Support

Finance

Administrator

Super Administrator



Policy Example

RequireRole("Administrator")

AND

RequireClaim("Permission", "ManageUsers")



5. API Gateway

Responsibilities:

Authentication 

Rate Limiting 

Request Logging 

Routing 

CORS 

Response Compression 

Request Size Validation 



Rate Limits

Endpoint

Limit

Login

10/min/IP

QR Scan

100/min/IP

Notification Submission

20/hour/IP

Admin APIs

300/min/user



6. Redis Caching

Cache Targets

Membership Plans 

Vehicle Makes/Models 

FAQ 

CMS Pages 

User Sessions 

Notification Counts 

Dashboard Summaries 



Cache Strategy

Client Request

      │

      ▼

Redis Cache

      │

 ┌────┴────┐

 ▼         ▼

Hit       Miss

 │         │

 ▼         ▼

Return   Database

             │

             ▼

        Update Cache



Cache Expiration

Data

TTL

Reference Data

24 hours

Dashboard Widgets

5 minutes

User Profile

10 minutes

Notification Count

1 minute



7. Message Queue

Purpose:

Decouple long-running operations 

Improve reliability 

Support retries 



Queued Tasks

Email Delivery 

SMS Delivery 

Push Notifications 

Invoice Generation 

Analytics Aggregation 

Report Generation 

Referral Reward Processing 



Queue Flow

API

 │

 ▼

Queue

 │

 ▼

Worker

 │

 ▼

Email/SMS/Storage



Retry Policy

Attempt 1

↓

5 Minutes

↓

30 Minutes

↓

2 Hours

↓

Dead Letter Queue



8. Background Processing

Recommended:

Hangfire

or

Quartz.NET



Jobs

Membership Expiry

Retry Notifications

Cleanup Sessions

Archive Notifications

Generate Reports

Backup Verification

Refresh Dashboard Cache

Cleanup Temporary Files



9. Object Storage

Recommended:

Amazon S3

Azure Blob Storage



Stored Objects

Profile Images

Vehicle Images

Documents

Invoices

Attachments

Exports



Security

Private buckets by default

Pre-signed URLs for downloads

Server-side encryption

Versioning enabled

Lifecycle rules for archival



10. CDN Strategy

Serve:

Images

CSS

JavaScript

Fonts

Public Documents



Benefits

Reduced latency

Lower origin load

Global availability



11. Payment Architecture

Supported Providers

Stripe

Future:

PayPal

Authorize.Net

Regional gateways



Payment Flow

Checkout

     │

     ▼

Create Payment Session

     │

     ▼

Gateway

     │

     ▼

Webhook

     │

     ▼

Verify Signature

     │

     ▼

Update Database

     │

     ▼

Generate Invoice



Security

Never store card numbers. 

Verify webhook signatures. 

Use idempotency keys. 

Encrypt gateway credentials. 

Reconcile transactions daily. 



12. Email & SMS

Email

Recommended Providers:

SendGrid 

Amazon SES 

Microsoft 365 SMTP 



SMS

Recommended Providers:

Twilio 

MessageBird 

AWS SNS 



All outbound messages should be queued and tracked.



13. Logging

Recommended:

Serilog



Destinations

Console

File

SQL

Elasticsearch

Application Insights (Azure)

CloudWatch (AWS)



Log Levels

Verbose

Debug

Information

Warning

Error

Fatal



Do not log:

Passwords

JWTs

Payment secrets

PII beyond operational necessity



14. Monitoring

Metrics

CPU 

Memory 

Disk 

API Latency 

Database Performance 

Queue Length 

Background Job Success 

Payment Success Rate 



Recommended Stack

Prometheus

↓

Grafana

↓

AlertManager



Alerts

High CPU

Database Down

Redis Down

Queue Growth

Payment Failure Spike

Failed Logins Spike



15. Security Architecture

Security Layers

Internet

     │

     ▼

WAF

     │

     ▼

Load Balancer

     │

     ▼

API Gateway

     │

     ▼

JWT Authentication

     │

     ▼

Authorization

     │

     ▼

Application

     │

     ▼

Database



Security Controls

TLS 1.2+ for all communications 

HSTS enabled 

Secure HTTP headers 

CSRF protection where applicable 

Input validation 

Output encoding 

SQL injection prevention via parameterized queries/ORM 

XSS mitigation 

CSP (Content Security Policy) 

Rate limiting 

Audit logging 

MFA for privileged accounts 



16. Disaster Recovery

Targets

Metric

Target

RTO

≤ 4 hours

RPO

≤ 15 minutes



Recovery Components

Daily Full Backups 

Transaction Log Backups 

Geo-Replicated Storage 

Secondary Database Replica 

Infrastructure as Code 

Automated Restore Testing 



17. High Availability

Load Balancer

      │

 ┌────┴────┐

 ▼         ▼

App 1     App 2

 │         │

 └────┬────┘

      ▼

 SQL Server Always On

 ┌──────────────┐

 │ Primary      │

 │ Secondary    │

 └──────────────┘



18. CI/CD Pipeline

Developer Commit

        │

        ▼

GitHub

        │

        ▼

Build

        │

        ▼

Unit Tests

        │

        ▼

Security Scan

        │

        ▼

Docker Build

        │

        ▼

Deploy to Staging

        │

        ▼

Integration Tests

        │

        ▼

Approval

        │

        ▼

Production Deployment



Pipeline Stages

Restore Dependencies 

Compile 

Run Unit Tests 

Static Code Analysis 

Security Scanning 

Build Docker Image 

Push to Container Registry 

Deploy 

Smoke Tests 



19. Kubernetes Deployment

Recommended Pods

API 

Worker 

Hangfire Dashboard (restricted) 

Redis 

RabbitMQ (if self-managed) 



Health Checks

Liveness Probe 

Readiness Probe 

Startup Probe 



Scaling

Horizontal Pod Autoscaler

Scale on:

CPU 

Memory 

Queue Length 

Request Rate 



20. Secrets Management

Never store secrets in source code.

Use:

AWS Secrets Manager 

Azure Key Vault 

Kubernetes Secrets (with encryption at rest) 

Environment Variables injected by deployment pipeline 



Managed Secrets

Database Connection Strings 

JWT Signing Keys 

Payment Gateway Credentials 

SMTP Credentials 

SMS Provider Keys 

Storage Access Keys 

API Keys 

OAuth Client Secrets 



Infrastructure Security Checklist

Requirement

Status

HTTPS Everywhere

Required

MFA for Admins

Required

Database Encryption

Required

Backup Encryption

Required

Secret Rotation

Required

Audit Logging

Required

WAF Protection

Required

DDoS Protection

Recommended

Vulnerability Scanning

Required

Penetration Testing

Recommended before production



Recommended Non-Functional Targets

Metric

Target

API Availability

99.9% or higher

Dashboard Load Time

< 2 seconds

QR Scan Response

< 200 ms

Notification Queue Processing

< 30 seconds (95th percentile)

Payment Confirmation

< 10 seconds

Backup Success Rate

100%

Critical Security Patch Deployment

Within defined organizational SLA



End of Part 8A

The infrastructure architecture now defines how TRAFFTAG is deployed, secured, monitored, and operated in production. Combined with Part 8, it provides a complete technical blueprint for building and running the platform.

DevOps, Operations & Quality Assurance Guide

Part 9 – DevOps, Release Management & QA

Version: 1.0

Target Audience

DevOps Engineers 

QA Engineers 

Release Managers 

Developers 

Product Owners 



Table of Contents

DevOps Strategy 

Git Workflow 

Branching Strategy 

Environment Strategy 

CI/CD Pipeline 

Database Migration 

Testing Strategy 

Security Testing 

Performance Testing 

Monitoring 

Incident Management 

Backup & Recovery 

Release Management 

Production Checklist 

Operational Runbooks 



1. DevOps Strategy

The TRAFFTAG platform follows Continuous Integration and Continuous Delivery (CI/CD) principles.

Objectives:

Automated builds 

Automated testing 

Secure deployments 

Zero-downtime releases 

Fast rollback capability 

Infrastructure as Code (IaC) 



2. Source Control Strategy

Recommended Platform

GitHub Enterprise 

Azure DevOps 

GitLab 



Repository Structure

trafftag/



├── frontend-web/

├── mobile-app/

├── backend-api/

├── worker-services/

├── infrastructure/

├── database/

├── documentation/

├── scripts/

└── docker/



3. Git Branching Strategy

Recommended Model

main

 │

 ├──────── develop

 │

 ├──────── feature/*

 │

 ├──────── release/*

 │

 ├──────── hotfix/*

 │

 └──────── bugfix/*



Branch Purpose

main

Production-ready code only.



develop

Integration branch.



feature/*

One feature per branch.

Example

feature/vehicle-registration



feature/payment-module



feature/qr-activation



release/*

Used before production.

Example

release/v1.0.0



hotfix/*

Production emergency fixes.



Pull Request Requirements

Every PR must have:

Minimum one reviewer (preferably two for critical components) 

Passing build 

Passing unit tests 

Static analysis completed 

Security scan passed (where applicable) 

Linked work item or issue 



Commit Message Convention

Use Conventional Commits:

feat(vehicle): add vehicle registration endpoint



fix(payment): resolve duplicate transaction issue



refactor(auth): simplify JWT validation



docs(api): update notification endpoints



test(vehicle): add repository tests



chore(ci): update build pipeline



4. Environment Strategy

Developer



↓



Development



↓



QA



↓



UAT



↓



Production



Development

Purpose

Developer testing.

Database

Development Database.



QA

Purpose

QA validation.

Automated tests.

Manual tests.



UAT

Business users.

Final approval.

Production-like environment.



Production

Live environment.

Restricted access.

Monitoring enabled.



Environment Configuration

Each environment should have:

Different

Database 

Storage 

API Keys 

Secrets 

Payment credentials 

SMTP credentials 

No production secrets may exist in non-production environments.



5. CI/CD Pipeline

Developer Commit

        │

        ▼

GitHub Push

        │

        ▼

Restore Packages

        │

        ▼

Compile

        │

        ▼

Unit Tests

        │

        ▼

Code Coverage

        │

        ▼

Static Analysis

        │

        ▼

Security Scan

        │

        ▼

Build Docker Image

        │

        ▼

Push Registry

        │

        ▼

Deploy Development

        │

        ▼

Integration Tests

        │

        ▼

Deploy QA

        │

        ▼

Approval

        │

        ▼

Deploy Production



Deployment Strategy

Recommended

Blue-Green Deployment

Alternative

Rolling Deployment

Avoid

Big-bang deployments.



Rollback Strategy

Each release must support:

Application rollback 

Database rollback (where feasible) 

Feature flag disablement 

Infrastructure rollback 

Target rollback time:

Less than 10 minutes.



6. Database Migration Strategy

Use:

Entity Framework Core Migrations

or

Versioned SQL scripts



Migration Rules

Every migration reviewed. 

Backward-compatible when possible. 

Tested in Development → QA → UAT. 

Include rollback instructions. 

Avoid long-running blocking migrations during business hours. 



Migration Naming

20260715_AddVehiclePreferences



20260720_CreateNotificationIndexes



20260801_AddMembershipBenefits



7. Testing Strategy

Testing Pyramid

              UI Tests

                 ▲

        Integration Tests

                 ▲

           Unit Tests



Unit Testing

Framework

xUnit

Coverage Target

≥80%

Critical Modules

≥90%



Modules

Authentication

Vehicle

QR

Payment

Notification

Membership



Integration Testing

Test

Database

Redis

Queue

Storage

Email

Payment



API Testing

Tools

Postman

Newman

REST Assured



Tests

Success

Validation

Security

Performance

Authorization



UI Testing

Recommended

Playwright

or

Cypress



Critical Scenarios

Login

Register

Vehicle Registration

QR Activation

Checkout

Support



8. Security Testing

Must Include

Dependency vulnerability scanning 

Static Application Security Testing (SAST) 

Dynamic Application Security Testing (DAST) 

Secret scanning 

Container image scanning 

Infrastructure security validation 

Manual penetration testing before major releases 



9. Performance Testing

Tools

k6 

Apache JMeter 

Gatling 



Target Scenarios

Login

QR Scan

Vehicle Search

Dashboard

Checkout

Notifications



Example Targets

Scenario

Users

Login

500 concurrent

QR Scan

2,000 concurrent

Dashboard

1,000 concurrent

Checkout

300 concurrent



10. Monitoring Strategy

Monitor

API response times 

Database CPU 

Redis memory 

Queue length 

Background jobs 

Payment failures 

Notification failures 

Authentication failures 

Application exceptions 



Alert Severity

P1

System Down

P2

Major Feature Down

P3

Minor Issue

P4

Cosmetic Issue



11. Incident Management

Incident Workflow

Alert



↓



Engineer Acknowledges



↓



Diagnosis



↓



Mitigation



↓



Root Cause Analysis



↓



Permanent Fix



↓



Post-Incident Review



Incident Documentation

Every incident records:

Summary 

Timeline 

Root cause 

Resolution 

Preventive actions 



12. Backup Strategy

Daily Full Backup

Hourly Differential Backup (or differential schedule appropriate to recovery objectives)

Transaction Log

Every 15 Minutes



Monthly Backup Verification

Restore into QA

Verify

Delete



13. Release Management

Release Checklist

Code freeze 

QA sign-off 

Security review 

Performance validation 

Documentation updated 

Database migration approved 

Rollback plan prepared 

Monitoring configured 

Stakeholder approval 



14. Production Deployment Checklist

Before Deployment

All tests passed 

Backups verified 

Database migration reviewed 

Release notes prepared 

Monitoring dashboards updated 

Team notified 



During Deployment

Deploy application 

Apply migrations 

Validate health checks 

Verify logs 

Smoke test 

Monitor error rate 



After Deployment

Verify login 

Verify QR scan 

Verify notifications 

Verify payments 

Verify reports 

Monitor for at least 30–60 minutes 



15. Operational Runbooks

Database High CPU

Identify expensive queries. 

Check blocking and deadlocks. 

Review execution plans. 

Scale resources if necessary. 

Escalate if unresolved. 



Redis Failure

Verify service availability. 

Clear unhealthy cache entries if required. 

Restart cache service according to operational procedures. 

Confirm application reconnects. 

Monitor performance. 



Queue Backlog

Check worker health. 

Scale worker instances. 

Review failed messages. 

Retry safe messages. 

Investigate recurring failures. 



Payment Gateway Outage

Confirm provider status. 

Disable new payment attempts if required. 

Queue pending payment requests where appropriate. 

Notify users of degraded service. 

Reconcile transactions after recovery. 



Email Delivery Failure

Verify provider availability. 

Review bounce and rejection logs. 

Retry queued messages. 

Escalate to provider if persistent. 



Service Level Objectives (SLOs)

Service

Target

Platform Availability

99.9%

API Availability

99.95%

Login Success Rate

>99.9%

QR Scan Availability

>99.95%

Payment Success (excluding provider issues)

>99%

Notification Delivery Queue

95% processed within 30 seconds



Documentation Standards

Every release must include:

Release notes 

API changes 

Database migration notes 

Configuration changes 

Known issues 

Rollback procedure 



End of Part 9

At this point, the documentation covers the full software delivery lifecycle:

✅ Business Requirements 

✅ Software Requirements 

✅ Database Design 

✅ REST API Specification 

✅ UI/UX Specification 

✅ Software Architecture 

✅ Cloud & Infrastructure 

✅ DevOps & Release Management 

Testing & Validation Specification

Part 10 – Quality Assurance & Test Strategy

Version: 1.0



Table of Contents

Testing Strategy 

Test Levels 

Test Environments 

Test Data Management 

Functional Testing 

API Testing 

Database Testing 

Security Testing 

Performance Testing 

Accessibility Testing 

Mobile Testing 

User Acceptance Testing 

Regression Testing 

Smoke Testing 

Production Validation 

Defect Management 

Requirement Traceability Matrix 



1. Testing Objectives

The primary objectives are:

Verify all functional requirements. 

Validate business rules. 

Confirm system security. 

Measure performance under expected load. 

Ensure compatibility across supported devices and browsers. 

Detect regressions before release. 

Demonstrate readiness for production. 



2. Testing Pyramid

                 Manual UAT

                     ▲

               UI Automation

                     ▲

            API Integration Tests

                     ▲

               Unit Tests



Testing Types

Test Type

Purpose

Unit Testing

Verify individual classes and methods

Integration Testing

Validate component interactions

API Testing

Validate REST endpoints

UI Testing

Validate user workflows

Database Testing

Verify persistence and integrity

Security Testing

Identify vulnerabilities

Performance Testing

Measure scalability

UAT

Validate business requirements



3. Test Environments

Development

Purpose

Developer verification.



QA

Purpose

Formal testing.

Configuration

Production-like.



UAT

Purpose

Business acceptance.

Contains

Representative production data (anonymized where required).



Production

Only

Smoke tests

Health checks

Monitoring validation



Environment Matrix

Environment

Database

External Services

Development

Development

Sandboxes / Mocks

QA

QA

Test Providers

UAT

UAT

Test Providers

Production

Production

Live Providers



4. Test Data Strategy

Test data should include:

New users 

Premium members 

Fleet customers 

Expired memberships 

Archived vehicles 

Lost QR tags 

Failed payments 

Refunded orders 

Support tickets 

Referral rewards 



Guidelines

No production PII in non-production environments. 

Synthetic or anonymized data preferred. 

Reset test data between major test cycles where practical. 



5. Functional Testing



Module 1 – Authentication

Test Case AUTH-001

Title

Register New User



Preconditions

User does not already exist.



Steps

Open Register page. 

Enter valid details. 

Accept Terms. 

Submit registration. 



Expected Result

User account created. 

Verification email queued. 

Audit log generated. 



Priority

Critical



Test Case AUTH-002

Title

Duplicate Email



Expected

Registration rejected.

Error message displayed.

No user created.



Test Case AUTH-003

Title

Weak Password



Expected

Validation message shown.

Registration blocked.



Test Case AUTH-004

Title

Login



Expected

JWT returned.

Refresh Token generated.

Login History recorded.



Test Case AUTH-005

Title

Forgot Password



Expected

Password reset email sent.

Token expires according to policy.



6. Vehicle Testing



VEH-001

Register Vehicle

Expected

Vehicle created.

Audit logged.

Vehicle visible in dashboard.



VEH-002

Duplicate VIN

Expected

Creation rejected.



VEH-003

Duplicate License Plate (same jurisdiction)

Expected

Validation error.



VEH-004

Upload Vehicle Images

Expected

Images stored.

Thumbnail generated.



VEH-005

Archive Vehicle

Expected

Vehicle archived.

QR deactivated.

History preserved.



7. QR Testing



QR-001

Activate QR

Expected

Status becomes Active.

Assignment created.



QR-002

Activate Invalid QR

Expected

Validation error.



QR-003

Replace QR

Expected

Old QR archived.

New QR assigned.

History retained.



QR-004

Scan QR

Expected

Notification page displayed.

Owner information hidden.



QR-005

Lost QR

Expected

Scan blocked.

Appropriate user message displayed.



8. Notification Testing



NOT-001

Submit Notification

Expected

Notification created.

Email queued.

SMS queued (if enabled).

Push queued (if enabled).



NOT-002

Spam Detection

Expected

Submission blocked according to configured rules.



NOT-003

Rate Limit

Expected

HTTP 429 returned.



NOT-004

Attachment Upload

Expected

Virus scan completed.

Attachment available to owner after validation.



9. Membership Testing



MEM-001

Purchase Membership

Expected

Order created.

Payment initiated.

Membership activated after successful payment.

Invoice generated.



MEM-002

Renew Membership

Expected

Expiry extended.

Renewal history recorded.



MEM-003

Expired Membership

Expected

Premium features disabled according to business rules.

Grace period handled if applicable.



10. Payment Testing



PAY-001

Successful Payment

Expected

Payment captured.

Invoice generated.

Order completed.



PAY-002

Payment Failure

Expected

Order remains pending or failed according to business rules.

No membership activation.



PAY-003

Refund

Expected

Refund recorded.

Customer notified.

Financial records updated.



PAY-004

Webhook Replay

Expected

Duplicate webhook ignored.

Idempotency maintained.



11. API Testing

Every endpoint should be tested for:

Success response 

Validation errors 

Authentication 

Authorization 

Invalid payload 

Invalid data types 

Missing fields 

Rate limiting 

Performance 

Idempotency (where applicable) 



Example

GET

GET /vehicles

Tests

Authorized 

Unauthorized 

Empty list 

Pagination 

Search 

Sorting 

Filtering 



12. Database Testing

Verify:

Primary Keys 

Foreign Keys 

Constraints 

Cascade behavior (where applicable) 

Soft deletes 

Stored procedures 

Views 

Index usage 

Data integrity 



Example

Vehicle Delete

Expected

Vehicle archived.

History retained.

Notifications preserved.



13. Security Testing

Tests include:

SQL Injection 

Cross-Site Scripting (XSS) 

Cross-Site Request Forgery (CSRF, where applicable) 

Authentication bypass 

JWT tampering 

Broken access control 

File upload validation 

Path traversal 

Rate limiting 

Brute-force resistance 



14. Performance Testing

Login

Concurrent Users

500

Target

< 500 ms (95th percentile)



QR Scan

Concurrent Users

2,000

Target

< 200 ms (95th percentile)



Dashboard

Concurrent Users

1,000

Target

< 2 seconds (95th percentile)



Checkout

Concurrent Users

300

Target

< 3 seconds (95th percentile)



15. Browser Compatibility

Supported Browsers

Chrome (latest 2 versions) 

Edge (latest 2 versions) 

Firefox (latest 2 versions) 

Safari (latest 2 versions) 



16. Mobile Testing

Devices

Android

iPhone

Tablet



Verify

Responsive layout 

Touch interactions 

Camera access for QR scanning (if applicable) 

File uploads 

Orientation changes 

Offline messaging (where supported) 



17. Accessibility Testing

Target

WCAG 2.1 AA

Verify

Keyboard navigation 

Screen readers 

Color contrast 

Focus indicators 

Form labels 

Error announcements 



18. Regression Testing

Executed:

Before every release 

After critical bug fixes 

After infrastructure changes 



Critical Regression Suite

Login 

Registration 

Vehicle Registration 

QR Activation 

QR Scan 

Notification Submission 

Membership Purchase 

Payment 

Invoice 

Dashboard 



19. Smoke Testing

Immediately after deployment:

Home page loads 

Login works 

Dashboard loads 

Vehicle list loads 

QR scan endpoint responds 

Notification creation works 

Payment gateway connectivity verified 

Database connectivity verified 

Queue workers operational 



20. Production Validation Checklist

Verify:

Application health endpoints 

Database availability 

Redis connectivity 

Queue processing 

Storage access 

Email delivery 

SMS delivery 

Payment gateway 

Monitoring dashboards 

Alerting 



21. Defect Lifecycle

New

 │

 ▼

Triaged

 │

 ▼

Assigned

 │

 ▼

In Progress

 │

 ▼

Code Review

 │

 ▼

Ready for QA

 │

 ▼

QA Passed

 │

 ▼

Closed

Possible alternate states:

Reopened 

Deferred 

Duplicate 

Rejected 

Cannot Reproduce 



Defect Severity

Severity

Description

Critical

System unavailable, security issue, data corruption

High

Major feature unusable

Medium

Functional issue with workaround

Low

Minor UI or cosmetic issue



Defect Priority

Priority

Description

P1

Immediate fix required

P2

Fix before release

P3

Schedule in upcoming sprint

P4

Backlog / enhancement



22. Requirement Traceability Matrix (RTM)

Requirement ID

Requirement

Test Case IDs

Status

AUTH-REQ-001

User Registration

AUTH-001, AUTH-002, AUTH-003

Covered

VEH-REQ-001

Register Vehicle

VEH-001, VEH-002, VEH-003

Covered

QR-REQ-001

Activate QR Tag

QR-001, QR-002

Covered

NOT-REQ-001

Submit Notification

NOT-001, NOT-002, NOT-003

Covered

PAY-REQ-001

Process Payment

PAY-001, PAY-002, PAY-004

Covered

The RTM should be maintained throughout the project to ensure every approved requirement has corresponding test coverage.



Quality Gates

A release may proceed only if:

✅ All critical test cases pass. 

✅ No open Critical or High severity defects remain without approved exceptions. 

✅ Code coverage meets agreed thresholds. 

✅ Performance objectives are met. 

✅ Security testing has passed. 

✅ UAT has been approved by business stakeholders. 

✅ Release checklist is complete. 



End of Part 10

At this point, the documentation covers the complete software lifecycle:

✅ Business Requirements (BRD) 

✅ Software Requirements (SRS) 

✅ Database Design 

✅ API Specification 

✅ UI/UX Specification 

✅ Software Architecture 

✅ Cloud & Infrastructure 

✅ DevOps & Release Management 

✅ Testing & Validation 

Project Management & Delivery Plan

Part 11 – Project Planning, Governance & Delivery

Version: 1.0

Prepared By: Project Management Office (PMO)

Methodology: Agile Scrum with DevOps



Table of Contents

Project Overview 

Project Objectives 

Project Scope 

Stakeholders 

Governance Structure 

Team Structure 

Development Methodology 

Roadmap 

Release Plan 

Sprint Planning 

Work Breakdown Structure (WBS) 

Timeline 

Resource Planning 

Risk Management 

Communication Plan 

Change Management 

Budget Estimation 

Success Metrics 

Go-Live Strategy 

Project Closure 



1. Project Overview

Project Name

TRAFFTAG – Vehicle Privacy & Smart QR Notification Platform



Vision

To create a secure, privacy-first platform that enables anyone to notify a vehicle owner through a QR code without exposing personal contact information.



Business Goals

Protect vehicle owner privacy 

Improve communication between strangers and vehicle owners 

Enable enterprise fleet management 

Build a scalable SaaS platform 

Support future international expansion 



2. Project Objectives

Primary Objectives

Launch MVP within planned timeline 

Support individual and fleet customers 

Provide secure QR-based communication 

Achieve high availability and performance 

Build a scalable cloud-native platform 



Success Criteria

Production-ready application 

Secure payment processing 

High user satisfaction 

Reliable notification delivery 

Comprehensive documentation 

Automated deployment pipeline 



3. Project Scope

In Scope

Public Website

Marketing pages 

Pricing 

Contact 

FAQ 



Customer Portal

Registration 

Login 

Dashboard 

Vehicle Management 

QR Management 

Membership 

Notifications 

Rewards 

Support 



Fleet Portal

Fleet Dashboard 

Driver Management 

Reports 

QR Management 



Administration Portal

User Management 

QR Inventory 

Membership Management 

Payment Administration 

CMS 

Reporting 

System Settings 



Backend

REST APIs 

Authentication 

Notifications 

Payment Integration 

Background Jobs 



Infrastructure

Cloud Hosting 

CI/CD 

Monitoring 

Logging 

Security 



Out of Scope (Phase 1)

AI-powered notification classification 

Native smartwatch applications 

Blockchain ownership verification 

Vehicle telematics integration 

Offline-first mobile applications 



4. Stakeholders

Role

Responsibility

Product Owner

Product vision and backlog

Project Manager

Planning and delivery

Solution Architect

Technical architecture

Technical Lead

Development leadership

UI/UX Designer

User experience

Backend Developers

APIs and services

Frontend Developers

Web application

QA Team

Validation and testing

DevOps Engineer

Infrastructure and deployments

Security Engineer

Security reviews

Business Stakeholders

Requirements and approvals



5. Governance Structure

Executive Sponsor

        │

        ▼

Steering Committee

        │

        ▼

Product Owner

        │

        ▼

Project Manager

        │

────────────────────────────────────────────

│          │          │         │

▼          ▼          ▼         ▼

Architecture Development QA DevOps



Responsibilities

Steering Committee

Budget approval 

Scope approval 

Strategic decisions 

Risk oversight 



Product Owner

Product backlog 

Feature prioritization 

Acceptance criteria 

Sprint acceptance 



Project Manager

Timeline 

Budget 

Risks 

Resource management 

Stakeholder communication 



6. Team Structure

Core Team

Role

Suggested Team Size

Product Owner

1

Project Manager

1

Scrum Master

1

Solution Architect

1

UI/UX Designer

2

Backend Developers

4

Frontend Developers

3

Mobile Developers

2

QA Engineers

3

DevOps Engineer

1

Security Engineer

1 (shared/part-time)

DBA

1

Total Core Team: ~20 members (adjust based on budget and scope).



7. Development Methodology

Agile Scrum

Sprint Length

2 Weeks



Ceremonies

Sprint Planning

Daily Stand-up

Sprint Review

Sprint Retrospective

Backlog Refinement



Artifacts

Product Backlog

Sprint Backlog

Burndown Chart

Velocity

Definition of Done



Definition of Done

A user story is complete only when:

Code developed 

Code reviewed 

Unit tests passed 

Integration tests passed 

QA approved 

Documentation updated 

Security review completed (where required) 

Merged to main development branch 



8. Product Roadmap

Phase 1 – Foundation

Duration

2 Months

Features

Authentication 

Users 

Vehicles 

QR Tags 



Phase 2 – Core Platform

Duration

2 Months

Features

Notifications 

Memberships 

Payments 

Rewards 



Phase 3 – Enterprise Features

Duration

2 Months

Features

Fleet Portal 

Reports 

Administration 

CMS 



Phase 4 – Optimization

Duration

1 Month

Features

Performance 

Security Hardening 

UAT 

Production Readiness 



9. Release Plan

Release

Major Deliverables

v0.1 Alpha

Authentication, basic vehicle registration

v0.5 Beta

QR activation, notifications, payments

v0.9 RC

Feature complete, UAT

v1.0 Production

Public launch

v1.1

Fleet enhancements

v1.2

Analytics improvements



10. Sprint Planning

Example Sprint

Sprint 1

Authentication

Registration

Login

JWT

Forgot Password



Sprint 2

Vehicle Registration

Vehicle Images

Vehicle List



Sprint 3

QR Activation

QR Assignment

QR Scan



Sprint 4

Notifications

Email

SMS

Push



Sprint 5

Membership

Payments

Invoices



Sprint 6

Support

Rewards

Reports



11. Work Breakdown Structure (WBS)

1. Project Initiation

   1.1 Requirements

   1.2 Architecture

   1.3 UI Design



2. Development

   2.1 Backend

   2.2 Frontend

   2.3 Mobile



3. Infrastructure

   3.1 Cloud

   3.2 CI/CD

   3.3 Monitoring



4. Testing

   4.1 QA

   4.2 UAT

   4.3 Performance



5. Deployment

   5.1 Production

   5.2 Hypercare



12. Project Timeline

Phase

Duration

Requirements

4 Weeks

UI/UX

4 Weeks

Backend Development

10 Weeks

Frontend Development

10 Weeks

QA Testing

6 Weeks

UAT

3 Weeks

Production Deployment

1 Week

Hypercare

2 Weeks

Estimated Total: 7–8 months (depending on team size and parallel execution).



13. Resource Planning

Development Capacity

Assuming:

2-week sprints 

10 working days 

6 productive hours/day 

Each developer contributes approximately:

60 productive hours per sprint

Actual capacity should account for meetings, support work, holidays, and leave.



14. Risk Register

ID

Risk

Probability

Impact

Mitigation

R001

Payment gateway delays

Medium

High

Early integration with sandbox

R002

Scope expansion

High

High

Formal change control

R003

Key team member unavailable

Medium

High

Cross-training and documentation

R004

Cloud service outage

Low

High

Multi-zone deployment and DR

R005

Security vulnerabilities

Medium

High

Secure SDLC, reviews, penetration testing

R006

Performance issues

Medium

Medium

Load testing and monitoring



15. Communication Plan

Meeting

Frequency

Participants

Daily Stand-up

Daily

Development Team

Sprint Planning

Every Sprint

Scrum Team

Sprint Review

Every Sprint

Stakeholders

Retrospective

Every Sprint

Scrum Team

Steering Committee

Monthly

Executives & PM

Risk Review

Monthly

PM, Architect, Leads



16. Change Management

Any change request should include:

Business justification 

Impact analysis 

Cost estimate 

Schedule impact 

Technical assessment 

Stakeholder approval 

Each approved change receives a unique Change Request (CR) identifier and is tracked to completion.



17. Budget Estimation

Budget Categories

Personnel 

Cloud Infrastructure 

Software Licenses 

Security & Compliance 

Testing Tools 

Third-Party APIs 

QR Tag Manufacturing 

Contingency Reserve 

The actual budget depends on team location, project duration, cloud usage, and licensing costs.



18. Success Metrics

KPI

Target

On-time delivery

≥95% of planned milestones

Sprint predictability

≥85% commitment achieved

Defect leakage to production

<2% of total defects

Production availability

≥99.9%

Customer satisfaction (CSAT)

≥4.5/5

Mean Time to Resolve (MTTR)

<4 hours for P1 incidents



19. Go-Live Strategy

Pre Go-Live

Production readiness review 

Final UAT sign-off 

Security approval 

Performance validation 

Backup verification 

Rollback plan approved 



Go-Live Day

Enable maintenance mode (if required). 

Deploy production release. 

Execute database migrations. 

Validate health checks. 

Perform smoke testing. 

Monitor logs, metrics, and alerts. 

Notify stakeholders of successful deployment. 



Hypercare (First 2 Weeks)

Daily health review meetings 

Enhanced monitoring 

Rapid defect response 

User feedback collection 

Production optimization 



20. Project Closure

A project is considered complete when:

All approved scope is delivered. 

Production is stable. 

Documentation is complete. 

Knowledge transfer is completed. 

Operational ownership is handed over. 

Outstanding issues are accepted or scheduled. 

Lessons learned are documented. 

Formal stakeholder sign-off is obtained. 



Project Deliverables Checklist

Deliverable

Status

Business Requirements Document (BRD)

✅

Software Requirements Specification (SRS)

✅

Database Design

✅

API Specification

✅

UI/UX Specification

✅

Software Architecture

✅

Infrastructure & Cloud Architecture

✅

DevOps & Operations Guide

✅

Testing & Validation Plan

✅

Project Management & Delivery Plan

✅



End of Part 11

The TRAFFTAG documentation now covers the business, technical, operational, testing, and project management aspects required for successful delivery.

User Manuals & Operations Guide

Part 12 – User Guides, SOPs & Operations Manual

Version: 1.0



Table of Contents

Customer User Guide 

Fleet Manager Guide 

Administrator Guide 

Customer Support Guide 

Installation Guide 

Configuration Guide 

Standard Operating Procedures (SOPs) 

Troubleshooting Guide 

Disaster Recovery Playbooks 

Maintenance Guide 

Frequently Asked Questions 

Knowledge Base Structure 



Section 1 – Customer User Guide

Introduction

Welcome to TRAFFTAG, a privacy-first platform that enables vehicle owners to receive notifications from members of the public without exposing personal contact information.



Creating an Account

Steps

Visit the TRAFFTAG website. 

Select Register. 

Enter: 

First Name 

Last Name 

Email Address 

Phone Number 

Password 

Accept the Terms & Conditions. 

Select Create Account. 

Verify your email address using the link sent to your inbox. 



Logging In

Open the login page. 

Enter your email and password. 

Select Login. 

If multi-factor authentication is enabled, complete the verification step. 



Registering a Vehicle

Open Vehicles. 

Select Add Vehicle. 

Enter vehicle details. 

Upload optional images and documents. 

Save the vehicle. 



Activating a QR Tag

Open QR Tags. 

Select Activate QR Tag. 

Scan the QR code or enter the serial number. 

Enter the activation code. 

Assign the QR tag to a registered vehicle. 



Receiving Notifications

When someone scans your QR code and submits a notification:

You receive an in-app notification. 

You may receive an email or SMS, depending on your preferences. 

Open the notification to view details and any attachments. 



Managing Membership

Users can:

View current plan 

Upgrade membership 

Renew membership 

View invoices 

Manage auto-renewal 



Support

To create a support request:

Open Support. 

Select Create Ticket. 

Choose a category. 

Describe the issue. 

Submit the ticket. 



Section 2 – Fleet Manager Guide

Fleet Dashboard

The Fleet Dashboard provides an overview of:

Total vehicles 

Assigned drivers 

Active QR tags 

Expiring registrations 

Notifications 



Adding a Fleet Vehicle

Select Fleet Vehicles. 

Click Add Vehicle. 

Enter vehicle information. 

Assign a driver (optional). 

Activate a QR tag. 

Save. 



Assigning Drivers

Open Drivers. 

Select a driver. 

Click Assign Vehicle. 

Choose a vehicle. 

Save. 



Running Reports

Fleet Managers can generate reports for:

Vehicle utilization 

Driver activity 

QR scan statistics 

Maintenance schedules 

Notification history 

Reports can be exported to PDF, Excel, or CSV.



Section 3 – Administrator Guide

Dashboard

The administrator dashboard displays:

Users 

Vehicles 

QR inventory 

Memberships 

Payments 

Notifications 

Support tickets 

System health 



User Management

Administrators can:

Search users 

View user profiles 

Suspend or reactivate accounts 

Reset passwords 

Assign roles 



QR Inventory

Administrators can:

Generate new QR tag batches 

View inventory 

Replace damaged tags 

Archive retired tags 



CMS Management

Content administrators can update:

Home page 

Pricing 

FAQ 

Privacy Policy 

Terms of Service 

Promotional banners 



Reporting

Available reports include:

Revenue 

Memberships 

QR activations 

Notifications 

Payments 

Support 

User growth 



Section 4 – Customer Support Guide

Ticket Workflow

New



↓



Assigned



↓



In Progress



↓



Customer Reply



↓



Resolved



↓



Closed



Support Responsibilities

Support agents should:

Verify customer identity where appropriate. 

Review account history. 

Resolve issues or escalate as needed. 

Document all actions. 

Maintain professional communication. 



Escalation Levels

Level

Responsibility

Level 1

General support

Level 2

Technical support

Level 3

Development team

Level 4

Infrastructure/DevOps



Section 5 – Installation Guide

System Requirements

Backend

.NET 8 

SQL Server 2022 

Frontend

Node.js 22 LTS (or project-supported LTS version) 

React 19 

Infrastructure

Redis 

Object Storage 

Message Queue 

SMTP Provider 



Installation Steps

Backend

Clone repository. 

Restore NuGet packages. 

Configure environment settings. 

Apply database migrations. 

Start API. 



Frontend

Install dependencies. 

Configure environment variables. 

Build. 

Start application. 



Infrastructure

Configure:

Database 

Redis 

Storage 

Email 

SMS 

Payment Gateway 



Section 6 – Configuration Guide

Required Environment Variables

Database Connection



JWT Secret



Redis Connection



Storage Connection



SMTP Settings



SMS API Key



Payment Gateway Keys



Application URL



Security Guidelines

Never commit secrets to source control. 

Rotate credentials periodically. 

Use a secrets management service in production. 

Restrict access using least-privilege principles. 



Section 7 – Standard Operating Procedures (SOPs)

SOP 1 – New User Registration

User registers. 

Verification email is sent. 

User confirms email. 

Account becomes active. 



SOP 2 – QR Replacement

Verify customer ownership. 

Mark existing QR tag as inactive. 

Issue replacement QR tag. 

Assign replacement to vehicle. 

Verify functionality. 



SOP 3 – Refund Processing

Validate eligibility. 

Review payment. 

Approve or reject request. 

Process refund through gateway. 

Notify customer. 

Update financial records. 



SOP 4 – User Suspension

Review incident. 

Document reason. 

Suspend account. 

Notify user (where appropriate). 

Record audit log. 



Section 8 – Troubleshooting Guide

Login Issues

Possible Causes

Incorrect credentials 

Account locked 

Email not verified 

Expired password 

Resolution

Reset password 

Unlock account (admin) 

Resend verification email 



QR Not Working

Check:

QR tag active 

Correct assignment 

Camera permissions 

Internet connectivity 



Notifications Not Received

Verify:

Notification preferences 

Email address 

SMS number 

Push notification permissions 

Queue processing status 



Payment Failure

Check:

Payment provider status 

Card validity 

Network connectivity 

Transaction logs 



Section 9 – Disaster Recovery Playbooks

Database Failure

Confirm outage. 

Fail over to secondary database (if configured). 

Validate application connectivity. 

Restore from backup if failover is unavailable. 

Verify data consistency. 

Communicate status to stakeholders. 



Redis Failure

Restart cache service if appropriate. 

Verify application reconnection. 

Monitor performance degradation. 

Restore clustered cache if applicable. 



Storage Failure

Confirm object storage availability. 

Switch to secondary region if configured. 

Restore service and validate uploads/downloads. 



Payment Gateway Failure

Verify provider status. 

Pause new payment attempts if necessary. 

Queue or retry eligible transactions. 

Notify users of degraded service. 

Reconcile transactions after recovery. 



Section 10 – Maintenance Guide

Daily

Review dashboards 

Check error logs 

Verify background jobs 

Monitor payment processing 

Monitor notification queues 



Weekly

Review security logs 

Check backup completion 

Review failed jobs 

Apply non-critical updates (as appropriate) 



Monthly

Verify backup restores 

Review performance trends 

Rotate secrets where required 

Review user permissions 

Conduct vulnerability scans 



Quarterly

Disaster recovery exercise 

Penetration testing 

Capacity planning review 

Dependency updates 

Architecture review 



Section 11 – Frequently Asked Questions

How do I replace a QR tag?

Open QR Tags, select the existing tag, and choose Replace QR Tag. Follow the replacement workflow.



Can multiple vehicles share one QR tag?

No. Each active QR tag can be assigned to only one active vehicle at a time.



Can I transfer a QR tag to another vehicle?

Yes, if the transfer complies with the platform's ownership and business rules.



What happens if my membership expires?

Premium features become unavailable according to your plan. Your vehicle and account data remain retained in accordance with the retention policy.



Is my phone number visible?

No. TRAFFTAG is designed so that QR scans do not expose your personal contact information.



Section 12 – Knowledge Base Structure

Getting Started



├── Account



├── Vehicles



├── QR Tags



├── Membership



├── Payments



├── Notifications



├── Fleet



├── Administration



├── Security



├── Troubleshooting



└── FAQs

Each article should include:

Overview 

Prerequisites 

Step-by-step instructions 

Screenshots (where applicable) 

Troubleshooting 

Related articles 

Revision history 



Revision History Template

Version

Date

Author

Description

1.0

Initial Release

Documentation Team

Initial publication

1.1

TBD

Documentation Team

Post-launch updates



Appendix A – Glossary

Term

Definition

QR Tag

A uniquely assigned QR code linked to a vehicle.

Fleet

A collection of vehicles managed by an organization.

Membership

A subscription granting platform features and limits.

Notification

A message sent to a vehicle owner after a QR scan.

UAT

User Acceptance Testing.

SLA

Service Level Agreement.

SLO

Service Level Objective.

KPI

Key Performance Indicator.

RBAC

Role-Based Access Control.

JWT

JSON Web Token.



Appendix B – Document Index

The TRAFFTAG documentation suite consists of:

Part

Document

Part 1

Business Requirements Document (BRD)

Part 2

Software Requirements Specification (SRS)

Part 3

Database Design & Data Dictionary

Part 4

Functional Requirements & Business Rules

Part 5

Entity Relationships, Workflows & Process Models

Part 6

REST API Specification

Part 7

UI/UX Functional Specification

Part 8

Software Architecture & Technical Design

Part 9

DevOps, Operations & Release Management

Part 10

Testing & Validation Specification

Part 11

Project Management & Delivery Plan

Part 12

User Manuals & Operations Guide



🎉 TRAFFTAG Enterprise Documentation Complete

With Parts 1 through 12, you now have a complete enterprise-grade documentation suite that covers the entire software lifecycle—from business concept to production operations.

Documentation Summary

Category

Status

Business Documentation

✅ Complete

Functional Requirements

✅ Complete

Software Requirements

✅ Complete

Database Design

✅ Complete

Business Rules & Workflows

✅ Complete

API Specification

✅ Complete

UI/UX Specification

✅ Complete

Enterprise Design System

✅ Complete

Software Architecture

✅ Complete

Cloud & Infrastructure

✅ Complete

DevOps & CI/CD

✅ Complete

Testing & QA

✅ Complete

Project Management

✅ Complete

User & Operations Manuals

✅ Complete

This collection forms a comprehensive blueprint that can guide product managers, designers, architects, developers, QA engineers, DevOps teams, and operations staff from initial planning through deployment and ongoing maintenance.

Bottom of Form

Bottom of Form



