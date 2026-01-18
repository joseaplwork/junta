# Junta System Design Document

> **Note for AI Assistants**: This document describes the business domain and data model for the Junta system. It focuses on _what_ the system does and _why_, not implementation details. When implementing features, refer to this document for domain understanding. If anything is unclear or you need to make design decisions, ask the user for clarification rather than making assumptions.

## Purpose

**La Junta** is a traditional savings system where a group of people contribute money over a period of time. The key characteristic is that participants can receive the total accumulated amount before the period ends, but everyone must complete their contributions regardless of when they receive their money.

The system tracks:

- Who participates in which juntas
- Payment schedules and amounts
- The order in which slots receive money (determined by raffle)
- Slot organization and participant assignments
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

### Slots

Slots are organizational units within a junta that handle money flow:

- **One slot is created per month** of the junta's duration
- Number of slots = number of months (maintains foundational 1:1 ratio)
- Slots are automatically created when a junta is created
- Slots belong directly to a junta (no intermediate group entity)
- A slot can contain one or more participants (odd or even numbers allowed)
- Each slot has an **order** (1, 2, 3, etc.) that determines when it receives money
- Order 1 = receives money in month 1, Order 2 = receives in month 2, etc.
- Admin can configure slot sizes and assign optional names
- A single participant can be their own slot
- A participant can only belong to one slot per junta

**Organizational Role**: Slots maintain the foundational concept where number of slots equals number of months, while allowing flexible participant grouping. This enables scenarios like 2 months with 3 participants (1 in slot 1, 2 in slot 2).

**Money Flow Through Slots**:

- **Collection**: Each slot collects money from its participants each month
- **Payout**: One slot receives the full total amount each month (in order)
- **Distribution**: When a slot receives money, it distributes equally among its participants

### Participants

People who participate in juntas:

- Participants can participate in multiple juntas simultaneously
- Participants are assigned to slots within juntas
- Each participant belongs to exactly one slot per junta
- Participants can participate in different juntas with different slot assignments
- A Participant must have at least a name, surname, and phone number
- A Participant can also be an Administrator (one-to-one relationship)

### Contribution Collection

**Key Concept**: Total amount is divided by number of **slots**, not participants.

- Each slot collects: `total_amount ÷ number_of_slots` per month
- Each participant in a slot pays: `(total_amount ÷ number_of_slots) ÷ number_of_participants_in_slot` per month
- Example: 2000€, 2 months (2 slots), 3 participants:
  - Slot 1 (1 participant): collects 1000€ per month (2000€ ÷ 2), participant pays 1000€
  - Slot 2 (2 participants): collects 1000€ per month (2000€ ÷ 2), each participant pays 500€ (1000€ ÷ 2)
- Example: 2000€, 4 months (4 slots), 8 participants:
  - Each slot collects 500€ per month (2000€ ÷ 4)
  - If slot has 2 participants: each pays 250€ (500€ ÷ 2)

**Money Flow**: Participants → pay to → Slot (collection) → Junta pool

### Money Distribution

When a slot receives money:

- The slot receives the **full total amount** (not the slot collection amount)
- The slot distributes the money equally among its participants
- Distribution calculation: `total_amount ÷ number_of_participants_in_slot`
- Example: Slot with order 1 has 2 participants, receives 2000€, distributes 1000€ to each participant
- Example: Slot with order 1 has 3 participants, receives 2000€, distributes ~666.67€ to each participant
- All participants continue paying every month through their slots, regardless of when their slot receives money

**Money Flow**: Junta pool → pays out to → Slot (payout: full total_amount) → distributes to → Participants (equal split)

### Payment Tracking

The system tracks all money transactions per junta:

- **Contributions**: Which participant has contributed for each month in each junta
- **Payouts**: When slots receive money (payout from pool) and whether they've been fully paid for a given month
- **Distributions**: How much each participant received when their slot got money

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

### Slot Assignment

- A Junta has a raffle to assign the order of money payout for slots (which slot receives money first)
- A Junta's admin can modify the order of money payout for slots after creation
- The order determines the sequence in which slots receive the total amount
- Number of slots = number of months (automatically created)
- Slots are assigned to juntas (one-to-many relationship)

### Participant Participation

- A Junta can be configured to assign the amount of people that will participate
- A Junta can have members assigned to slots (can be odd or even numbers, no restriction)
- A Junta has members that are participants
- Participants can participate in multiple juntas simultaneously
- Participants are assigned to exactly one slot per junta
- The members of a slot must pay their share of the slot's collection amount
- A Participant must have at least a name, surname, and phone number
- **Total amount is divided by number of slots, not participants**

### Payment Tracking

- Track participant contributions per month per junta (which participant has contributed, amount, status)
- Track slot payout status per month per junta (when slot received money from pool, if fully paid)
- Track participant distributions per junta (how much each participant received when their slot got money)
- Admin can check contribution status per participant per month per junta
- System tracks slot payout completion status

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

- Can belong to multiple slots (through ParticipantsSlots, one per junta)
- Can participate in multiple juntas (through slots)
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

**Note**: The number of slots equals the duration in months (calculated from start_date and end_date, or can be stored as a separate duration field). Slots are created automatically when the junta is created.

**Relationships:**

- Has one administrator (many-to-one)
- Contains multiple slots (one-to-many)
- Slots contain participants (many-to-many through ParticipantsSlots)

#### Slots

Organizational units representing payment periods within a junta.

**Attributes:**

- name (optional - admin can name slots)
- order (integer) - The sequence in which this slot receives money (1 = month 1, 2 = month 2, etc.)
- junta_id (uuid, FK to Juntas)

**Relationships:**

- Belongs to one junta (many-to-one)
- Contains multiple participants (many-to-many through ParticipantsSlots)
- One slot is created per month of the junta
- Has many Payouts (one-to-many, per month)

**Purpose:**

- Maintains foundational 1:1 ratio (months:slots) with flexible participant grouping
- Handles money collection from participants
- Receives money from junta pool (one per month, in order)
- Distributes money to participants (equal split)

#### ParticipantsSlots (Junction Table)

Links participants to slots.

**Attributes:**

- participant_id (uuid, FK to Participants)
- slot_id (uuid, FK to Slots)

**Purpose:**

- Establishes which participants belong to which slots
- Ensures one participant can only belong to one slot per junta

#### Contributions

Tracks participant contributions per month per junta.

**Attributes:**

- id (uuid, primary key)
- participant_id (uuid, FK to Participants)
- junta_id (uuid, FK to Juntas)
- slot_id (uuid, FK to Slots) - Which slot the participant belongs to
- month (integer) - Which month of the junta (1, 2, 3, etc.)
- amount (decimal) - Amount contributed (calculated: (total_amount ÷ number_of_slots) ÷ number_of_participants_in_slot)
- paid_date (timestamptz) - When contribution was made
- status (enum: 'pending', 'paid', 'overdue') - Contribution status

**Purpose:**

- Tracks which participant has contributed for each month in each junta
- Amount is based on slot collection amount (total_amount ÷ number_of_slots) divided by participants in slot
- Allows admin to check contribution status per participant per month per junta

#### Payouts

Tracks when slots receive money (payout from junta pool) per junta.

**Attributes:**

- id (uuid, primary key)
- slot_id (uuid, FK to Slots)
- junta_id (uuid, FK to Juntas)
- month (integer) - Which month of the junta (1, 2, 3, etc.)
- amount_received (decimal) - Full total amount received (total_amount)
- received_date (timestamptz) - When money was received
- is_fully_paid (boolean) - Whether slot has been fully paid for this month

**Purpose:**

- Tracks that a slot has received its payout from the junta pool for the given month
- Amount received is always the full total_amount
- Links to Distributions to track how money was distributed

#### Distributions

Tracks how much each participant received per junta.

**Attributes:**

- id (uuid, primary key)
- payout_id (uuid, FK to Payouts)
- participant_id (uuid, FK to Participants)
- junta_id (uuid, FK to Juntas)
- amount_distributed (decimal) - Amount participant received (calculated: total_amount ÷ participants_in_slot)
- distributed_date (timestamptz) - When distribution was made

**Purpose:**

- Tracks how much each participant has received when their slot got money
- Amount is full total_amount divided by number of participants in slot
- Links to Payout to track which payout this distribution came from

## Relationship Flow

### Creating a Junta

1. Admin creates a junta with: name, total amount, duration (months), start/end dates
2. System automatically creates slots (one per month)
3. Slots are linked to the junta
4. Participants are assigned to slots
5. Slots are assigned an order through raffle (order 1 = month 1, order 2 = month 2, etc.)
6. Order determines which slot receives money first (order 1 = first, etc.)

### Participant Participation

- Participants are assigned to slots within a junta
- Each participant belongs to exactly one slot per junta
- Participants can be in multiple juntas (different slots, different orders)
- To find all juntas a participant participates in: Participant → ParticipantsSlots → Slots → Junta

### Money Collection Flow

- Each slot collects: `total_amount ÷ number_of_slots` per month
- Participants in a slot pay: `(total_amount ÷ number_of_slots) ÷ number_of_participants_in_slot` per month
- All slots collect money from their participants → Junta pool
- Total collected each month = total_amount (sum of all slots' collections)

### Money Payout Flow

- Junta pool → pays out to one Slot (full total_amount, in order)
- Slot receives money when it's their month (based on order)
- Slot → distributes to its participants (equal split: total_amount ÷ participants_in_slot)
- All participants continue contributing every month, regardless of when their slot receives money

### Payment Tracking Flow

- **Contributions**: Tracked per participant per month per junta
  - Participant makes contribution → recorded in Contributions entity
  - Amount calculated: (total_amount ÷ number_of_slots) ÷ number_of_participants_in_slot
  - Status: pending, paid, or overdue
- **Payouts**: Tracked per slot per month per junta
  - Slot receives money from pool → recorded in Payouts entity
  - Amount: full total_amount
  - is_fully_paid: tracks if slot has been fully paid for the month
- **Distributions**: Tracked per participant per junta
  - When slot receives money → Distributions created for each participant in slot
  - Amount: total_amount ÷ participants_in_slot
  - Links to Payout to track source

## Key Business Rules

1. **One slot per month**: When a junta is created, exactly one slot is created for each month
2. **Total amount divided by slots**: Total amount is divided by number of slots (not participants)
3. **Order is for payout, not contribution**: The order determines which slot gets money first, not contribution order
4. **Participants can be in multiple juntas**: A participant can participate in different juntas simultaneously with different slot assignments
5. **One slot per participant per junta**: A participant can only belong to one slot per junta
6. **Raffle assignment**: Initial order is assigned randomly through a raffle when junta is created
7. **Admin can modify**: Admins can change the order after creation
8. **Equal splits**: All money distributions are equal splits (no weighted distributions)
9. **All tracking per junta**: Contributions, payouts, and distributions are tracked per junta (participants can be in multiple juntas)
10. **Physical money**: The system tracks everything, but actual money is managed physically offline

## Example Scenarios

### Scenario 1 (Foundation): 2000€, 2 months, 2 participants

- 2 slots created (one per month)
- Each slot collects 1000€/month (2000€ ÷ 2)
- Each participant pays 1000€/month (1 participant per slot)
- Each slot receives 2000€ when it's their turn (order 1 = month 1, order 2 = month 2)
- Each participant receives 2000€ when their slot receives money

### Scenario 2: 2000€, 2 months, 3 participants

- 2 slots created
- Slot 1 (1 participant): collects 1000€/month, participant pays 1000€/month, receives 2000€ (distributes 2000€ to participant)
- Slot 2 (2 participants): collects 1000€/month, each participant pays 500€/month, receives 2000€ (distributes 1000€ to each participant)

### Scenario 3: 2000€, 4 months, 4 participants

- 4 slots created
- Each slot collects 500€/month (2000€ ÷ 4)
- Each participant pays 500€/month (1 participant per slot)
- Each slot receives 2000€ when it's their turn (orders 1-4)
- Each participant receives 2000€ when their slot receives money

### Scenario 4: 2000€, 4 months, 8 participants

- 4 slots created
- Each slot collects 500€/month (2000€ ÷ 4)
- If each slot has 2 participants: each participant pays 250€/month (500€ ÷ 2)
- Each slot receives 2000€ when it's their turn (distributes 1000€ to each participant)

### Scenario 5: 2000€, 4 months, 7 participants

- 4 slots created
- Each slot collects 500€/month (2000€ ÷ 4)
- Slots might have: 2, 2, 2, 1 participants
- Participants pay: 250€ (if in slot with 2 participants), 500€ (if in slot with 1 participant)
- Each slot receives 2000€ when it's their turn
- Distribution: 1000€ to each participant (if slot has 2), 2000€ (if slot has 1)

### Scenario 6: Participant in Multiple Juntas

- Participant participates in Junta A (2 months, slot 1) and Junta B (4 months, slot 3) simultaneously
- Each junta tracks contributions, payouts, and distributions independently
- Participant contributes different amounts per month in each junta (based on each junta's total and slot configuration)
- Participant receives money at different times in each junta (when their slot receives payout in each junta)

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
- Slot rebalancing if participants leave
- Automated payment tracking integration
