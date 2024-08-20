# Purpose

La Junta:
It is a way to save money in a specific period of time with the benefit of probably getting the total amount saved before the ending period but always completing paying the total amount, it is also composed of a group of people.

We need to store the information of "La junta" which is a conceptual idea that is represented physically but is really hard to keep track of events and money that composes the cycle of "La junta" so for that we would like to create an app that will keep track of "La junta"

# Functional requirements

- A Junta can be created at any time
- A Junta can stablish the start and end date
- A Junta's period is specified in months
- A Junta has a total amount specified
- A Junta has a raffle to assign the order of the payment for a group
- A Junta's admin can modify the order of the payment for the groups
- A Junta can be configured to assign the amount of people that will participate on it
- A Junta contains groups that are equal to be number of months
- A Group will have a partial amount assigned which will equal to the total amount divided by the numbers of months
- A Junta can have members assigned to those groups, preferably an even number of members
- A Junta has members that are users
- The Members of a group must pay the proportional part of the partial amount of that Group
- An User must have at least a name and surname and a username
- A Junta should have statuses to indicate if is active or finished
- A Junta has an administrator that will able to create Juntas
- An Administrator can register users
- A Junta has the money managed physically

# Data points collection

- Name
- Surname
- Phone number
- Junta name
- Junta total amount
- Junta duration
- Junta Total number of participants
- Group partial amount
- Group size
- Junta amount

# Entities

- Users
- Administrators
- Juntas
- Juntas-Groups
- Juntas-PartialAmount
- Groups
- Groups-Users

# Relationships

- Users
  \_ name
  \_ surname
  \_ phone_number
- Administrators
  \_ user
  \_ role
  \_ username
  \_ password
- Juntas
  \_ duration
  \_ amount
  \_ start_date
  \_ end_date
  \_ active
  \_ admin
- Juntas-Groups
  \_ junta_id
  \_ group_id
  \_ order
- Juntas-PartialAmount
  \_ date
  \_ paid
  \_ partial_amount
- Groups
  \_ name
  \_ creation_date
- Groups-Users
  \_ group_id
  \_ user_id
