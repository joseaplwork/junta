# Junta System Design Document

> **Note for AI Assistants**: This document describes the business domain and data model for the Junta system. It focuses on _what_ the system does and _why_, not implementation details. When implementing features, refer to this document for domain understanding. If anything is unclear or you need to make design decisions, ask the user for clarification rather than making assumptions.

## Purpose

**La Junta** is a traditional savings system where a group of people contribute money over a period of time. The key characteristic is that participants can receive the total accumulated amount before the period ends, but everyone must complete their contributions regardless of when they receive their money.

The system tracks:

- Who participates in which juntas
- Payment schedules and amounts
- The order in which groups receive money (determined by raffle)
- Group organization and participant assignments
- Contribution, payout, and distribution tracking per junta
- Administrative oversight

## Core Concepts

### Junta

A savings cycle with:

- A fixed total amount to be collected
- A specific duration (in months) - dynamic from 1 month to 1 year or more
- A start and end date
- Multiple participants
- An administrator who manages it
- Status (active or finished)

### Groups

Groups are organizational units within a junta that handle money flow:

- **One group is created per month** of the junta's duration
- Number of groups = number of months (maintains foundational 1:1 ratio)
- Groups are automatically created when a junta is created
- Groups belong directly to a junta (no intermediate group entity)
- A group can contain one or more participants (odd or even numbers allowed)
- Each group has an **order** (1, 2, 3, etc.) that determines when it receives money
- Order 1 = receives money in month 1, Order 2 = receives in month 2, etc.
- Admin can configure group sizes and assign optional names
- A single participant can be their own group
- A participant can only belong to one group per junta

**Organizational Role**: Groups maintain the foundational concept where number of groups equals number of months, while allowing flexible participant grouping. This enables scenarios like 2 months with 3 participants (1 in group 1, 2 in group 2).

**Money Flow Through Groups**:

- **Collection**: Each group collects money from its participants each month
- **Payout**: One group receives the full total amount each month (in order)
- **Distribution**: When a group receives money, it distributes equally among its participants

### Participants

People who participate in juntas:

- Participants can participate in multiple juntas simultaneously
- Participants are assigned to groups within juntas
- Each participant belongs to exactly one group per junta
- Participants can participate in different juntas with different group assignments
- A Participant must have at least a name, surname, and phone number
- A Participant can also be an Administrator (one-to-one relationship)

### Contribution Collection

**Key Concept**: Total amount is divided by number of **groups**, not participants.

- Each group collects: `total_amount ÷ number_of_groups` per month
- Each participant in a group pays: `(total_amount ÷ number_of_groups) ÷ number_of_participants_in_group` per month
- Example: 2000€, 2 months (2 groups), 3 participants:
  - Group 1 (1 participant): collects 1000€ per month (2000€ ÷ 2), participant pays 1000€
  - Group 2 (2 participants): collects 1000€ per month (2000€ ÷ 2), each participant pays 500€ (1000€ ÷ 2)
- Example: 2000€, 4 months (4 groups), 8 participants:
  - Each group collects 500€ per month (2000€ ÷ 4)
  - If group has 2 participants: each pays 250€ (500€ ÷ 2)

**Money Flow**: Participants → pay to → Group (collection) → Junta pool

### Money Distribution

When a group receives money:

- The group receives the **full total amount** (not the group collection amount)
- The group distributes the money equally among its participants
- Distribution calculation: `total_amount ÷ number_of_participants_in_group`
- Example: Group with order 1 has 2 participants, receives 2000€, distributes 1000€ to each participant
- Example: Group with order 1 has 3 participants, receives 2000€, distributes ~666.67€ to each participant
- All participants continue paying every month through their groups, regardless of when their group receives money

**Money Flow**: Junta pool → pays out to → Group (payout: full total_amount) → distributes to → Participants (equal split)

### Payment Tracking

The system tracks all money transactions per junta:

- **Contributions**: Which participant has contributed for each month in each junta
- **Payouts**: When groups receive money (payout from pool) and whether they've been fully paid for a given month
- **Distributions**: How much each participant received when their group got money

All tracking is per junta, allowing participants to participate in multiple juntas simultaneously with independent tracking.

## Functional Requirements

### Junta Management

- A Junta can be created at any time
- A Junta establishes start and end dates
- A Junta's period is specified in months (dynamic: 2 month to 1 year or more)
- A Junta has a total amount specified
- A Junta should have statuses to indicate if it is active or finished
- A Junta has an administrator who can create and manage juntas
- A Junta has money managed physically (the system tracks, but money is handled offline for now)

### Group Assignment

- A Junta's admin determines the order of money payout for groups (which group receives money first)
- The order can be assigned through a raffle (random assignment) or manually configured by the admin
- A Junta's admin can modify the order of money payout for groups after creation
- The order determines the sequence in which groups receive the total amount
- Number of groups = number of months (automatically created)
- Groups are assigned to juntas (one-to-many relationship)

### Participant Participation

- A Junta can be configured to assign the amount of people that will participate
- A Junta can have members assigned to groups (can be odd or even numbers, no restriction)
- A Junta has members that are participants
- Participants can participate in multiple juntas simultaneously
- Participants are assigned to exactly one group per junta
- The members of a group must pay their share of the group's collection amount
- A Participant must have at least a name, surname, and phone number
- **Total amount is divided by number of groups, not participants**

### Payment Tracking

- Track participant contributions per month per junta (which participant has contributed, amount, status)
- Track group payout status per month per junta (when group received money from pool, if fully paid)
- Track participant distributions per junta (how much each participant received when their group got money)
- Admin can check contribution status per participant per month per junta
- System tracks group payout completion status

### Administration

- An Administrator can register participants
- Administrators have roles and permissions
- Administrators are linked to participant accounts (one-to-one relationship)
- A Participant can also be an Administrator

## Data Model

### Entities

#### Participants

People who participate in juntas.

**Attributes:**

- name
- surname
- phone_number

**Relationships:**

- Can belong to multiple groups (through ParticipantsGroups, one per junta)
- Can participate in multiple juntas (through groups)
- Can be linked to an Administrator account (one-to-one relationship)
- A Participant can also be an Administrator
- Has many Contributions (one-to-many, per junta)
- Has many Distributions (one-to-many, per junta)

#### Administrators

Participants who can create and manage juntas.

**Attributes:**

- email
- password
- roles (array of permissions)

**Relationships:**

- Linked to a Participant account (one-to-one)
- A Participant can also be an Administrator
- Can create and manage multiple juntas

#### Juntas

Savings cycles with participants and payment schedules.

**Attributes:**

- name
- total amount
- start_date
- end_date
- active (boolean status)
- admin_id (creator/administrator)

**Note**: The number of groups equals the duration in months (calculated from start_date and end_date, or can be stored as a separate duration field). Groups are created automatically when the junta is created.

**Relationships:**

- Has one administrator (many-to-one)
- Contains multiple groups (one-to-many)
- Groups contain participants (many-to-many through ParticipantsGroups)

#### Groups

Organizational units representing payment periods within a junta.

**Attributes:**

- name (optional - admin can name groups)
- order (integer) - The sequence in which this group receives money (1 = month 1, 2 = month 2, etc.)
- junta_id (uuid, FK to Juntas)

**Relationships:**

- Belongs to one junta (many-to-one)
- Contains multiple participants (many-to-many through ParticipantsGroups)
- One group is created per month of the junta
- Has many Payouts (one-to-many, per month)

**Purpose:**

- Maintains foundational 1:1 ratio (months:groups) with flexible participant grouping
- Handles money collection from participants
- Receives money from junta pool (one per month, in order)
- Distributes money to participants (equal split)

#### ParticipantsGroups (Junction Table)

Links participants to groups.

**Attributes:**

- participant_id (uuid, FK to Participants)
- group_id (uuid, FK to Groups)

**Purpose:**

- Establishes which participants belong to which groups
- Ensures one participant can only belong to one group per junta

#### Contributions

Tracks participant contributions per month per junta.

**Attributes:**

- id (uuid, primary key)
- participant_id (uuid, FK to Participants)
- junta_id (uuid, FK to Juntas)
- group_id (uuid, FK to Groups) - Which group the participant belongs to
- month (integer) - Which month of the junta (1, 2, 3, etc.)
- amount (decimal) - Amount contributed (calculated: (total_amount ÷ number_of_groups) ÷ number_of_participants_in_group)
- paid_date (timestamptz) - When contribution was made
- status (enum: 'pending', 'paid', 'overdue') - Contribution status

**Purpose:**

- Tracks which participant has contributed for each month in each junta
- Amount is based on group collection amount (total_amount ÷ number_of_groups) divided by participants in group
- Allows admin to check contribution status per participant per month per junta

#### Payouts

Tracks when groups receive money (payout from junta pool) per junta.

**Attributes:**

- id (uuid, primary key)
- group_id (uuid, FK to Groups)
- junta_id (uuid, FK to Juntas)
- month (integer) - Which month of the junta (1, 2, 3, etc.)
- amount_received (decimal) - Full total amount received (total_amount)
- received_date (timestamptz) - When money was received
- is_fully_paid (boolean) - Whether group has been fully paid for this month

**Purpose:**

- Tracks that a group has received its payout from the junta pool for the given month
- Amount received is always the full total_amount
- Links to Distributions to track how money was distributed

#### Distributions

Tracks how much each participant received per junta.

**Attributes:**

- id (uuid, primary key)
- payout_id (uuid, FK to Payouts)
- participant_id (uuid, FK to Participants)
- junta_id (uuid, FK to Juntas)
- amount_distributed (decimal) - Amount participant received (calculated: total_amount ÷ participants_in_group)
- distributed_date (timestamptz) - When distribution was made

**Purpose:**

- Tracks how much each participant has received when their group got money
- Amount is full total_amount divided by number of participants in group
- Links to Payout to track which payout this distribution came from

## Relationship Flow

### Creating a Junta

1. Admin creates a junta with: name, total amount, duration (months), start/end dates
2. System automatically creates groups (one per month)
3. Groups are linked to the junta
4. Participants are assigned to groups
5. Groups are assigned an order through raffle (order 1 = month 1, order 2 = month 2, etc.)
6. Order determines which group receives money first (order 1 = first, etc.)

### Participant Participation

- Participants are assigned to groups within a junta
- Each participant belongs to exactly one group per junta
- Participants can be in multiple juntas (different groups, different orders)
- To find all juntas a participant participates in: Participant → ParticipantsGroups → Groups → Junta

### Money Collection Flow

- Each group collects: `total_amount ÷ number_of_groups` per month
- Participants in a group pay: `(total_amount ÷ number_of_groups) ÷ number_of_participants_in_group` per month
- All groups collect money from their participants → Junta pool
- Total collected each month = total_amount (sum of all groups' collections)

### Money Payout Flow

- Junta pool → pays out to one Group (full total_amount, in order)
- Group receives money when it's their month (based on order)
- Group → distributes to its participants (equal split: total_amount ÷ participants_in_group)
- All participants continue contributing every month, regardless of when their group receives money

### Payment Tracking Flow

- **Contributions**: Tracked per participant per month per junta
  - Participant makes contribution → recorded in Contributions entity
  - Amount calculated: (total_amount ÷ number_of_groups) ÷ number_of_participants_in_group
  - Status: pending, paid, or overdue
- **Payouts**: Tracked per group per month per junta
  - Group receives money from pool → recorded in Payouts entity
  - Amount: full total_amount
  - is_fully_paid: tracks if group has been fully paid for the month
- **Distributions**: Tracked per participant per junta
  - When group receives money → Distributions created for each participant in group
  - Amount: total_amount ÷ participants_in_group
  - Links to Payout to track source

## Key Business Rules

1. **One group per month**: When a junta is created, exactly one group is created for each month
2. **Total amount divided by groups**: Total amount is divided by number of groups (not participants)
3. **Order is for payout, not contribution**: The order determines which group gets money first, not contribution order
4. **Participants can be in multiple juntas**: A participant can participate in different juntas simultaneously with different group assignments
5. **One group per participant per junta**: A participant can only belong to one group per junta
6. **Raffle assignment**: Initial order is assigned randomly through a raffle when junta is created
7. **Admin can modify**: Admins can change the order after creation
8. **Equal splits**: All money distributions are equal splits (no weighted distributions)
9. **All tracking per junta**: Contributions, payouts, and distributions are tracked per junta (participants can be in multiple juntas)
10. **Physical money**: The system tracks everything, but actual money is managed physically offline

## Example Scenarios

### Scenario 1 (Foundation): 2000€, 2 months, 2 participants

- 2 groups created (one per month)
- Each group collects 1000€/month (2000€ ÷ 2)
- Each participant pays 1000€/month (1 participant per group)
- Each group receives 2000€ when it's their turn (order 1 = month 1, order 2 = month 2)
- Each participant receives 2000€ when their group receives money

### Scenario 2: 2000€, 2 months, 3 participants

- 2 groups created
- Group 1 (1 participant): collects 1000€/month, participant pays 1000€/month, receives 2000€ (distributes 2000€ to participant)
- Group 2 (2 participants): collects 1000€/month, each participant pays 500€/month, receives 2000€ (distributes 1000€ to each participant)

### Scenario 3: 2000€, 4 months, 4 participants

- 4 groups created
- Each group collects 500€/month (2000€ ÷ 4)
- Each participant pays 500€/month (1 participant per group)
- Each group receives 2000€ when it's their turn (orders 1-4)
- Each participant receives 2000€ when their group receives money

### Scenario 4: 2000€, 4 months, 8 participants

- 4 groups created
- Each group collects 500€/month (2000€ ÷ 4)
- If each group has 2 participants: each participant pays 250€/month (500€ ÷ 2)
- Each group receives 2000€ when it's their turn (distributes 1000€ to each participant)

### Scenario 5: 2000€, 4 months, 7 participants

- 4 groups created
- Each group collects 500€/month (2000€ ÷ 4)
- Groups might have: 2, 2, 2, 1 participants
- Participants pay: 250€ (if in group with 2 participants), 500€ (if in group with 1 participant)
- Each group receives 2000€ when it's their turn
- Distribution: 1000€ to each participant (if group has 2), 2000€ (if group has 1)

### Scenario 6: Participant in Multiple Juntas

- Participant participates in Junta A (2 months, group 1) and Junta B (4 months, group 3) simultaneously
- Each junta tracks contributions, payouts, and distributions independently
- Participant contributes different amounts per month in each junta (based on each junta's total and group configuration)
- Participant receives money at different times in each junta (when their group receives payout in each junta)

## Questions for Clarification

When implementing features, consider asking about:

- How the raffle works (random assignment, weighted, etc.)
- What happens if a participant leaves a junta mid-cycle?
- How are payment reminders or notifications handled?
- Can the order be changed after money has been distributed?
- How are partial payments handled if a participant can't pay the full amount?

## Future Considerations

- Payment reminders and notifications
- Reporting and analytics
- Participant history and participation tracking
- Group rebalancing if participants leave
- Automated payment tracking integration
