---
name: NestJS API Development
description: NestJS backend conventions, controller patterns, HTTP verbs, guards, and service layer practices.
---

# NestJS API Development

This skill provides patterns and conventions for building the NestJS backend API.

## When to Use

- When creating or modifying API controllers in `apps/api/`
- When implementing endpoints and routes
- When working with guards and decorators
- When structuring service layers
- When handling errors and responses

## NestJS Conventions

### Decorators and Routing

- Use decorators for routing (`@Get`, `@Post`, `@Patch`, `@Delete`)
- Use guards for authentication and authorization
- Use decorators for extracting request data (`@Body`, `@Param`, `@Query`)

## Controller Structure

Controllers should follow this pattern:

```typescript
@Controller('participant')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Get()
  findAll(): Promise<Participant[]> {
    return this.participantService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Participant> {
    return this.participantService.findOne(id)
  }

  @Post()
  create(@Body() payload: CreateParticipantDto): Promise<Participant> {
    return this.participantService.create(payload)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateParticipantDto,
  ): Promise<Participant> {
    return this.participantService.update(id, payload)
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.participantService.delete(id)
  }
}
```

## HTTP Verb Usage

Use the correct HTTP verbs for operations:

- `GET` - Retrieve resources (list or single item)
- `POST` - Create new resources
- `PATCH` - Partial updates (preferred over PUT)
- `DELETE` - Remove resources

### Important

Always match the HTTP verb used in the frontend service. If the frontend uses `.patch()`, the controller must use `@Patch()`.

## Guards and Decorators

### Authentication and Authorization

- Use `@UseGuards()` for authentication/authorization
- Create custom decorators for common patterns
- Use `@IsPublic()` decorator for unauthenticated endpoints

### Example

```typescript
@Controller('participant')
@UseGuards(AuthGuard, PermissionsGuard)
export class ParticipantController {
  @Get()
  @Permissions(Permission.PARTICIPANT_READ)
  findAll(): Promise<Participant[]> {
    return this.participantService.findAll()
  }

  @Post('public')
  @IsPublic()
  createPublic(@Body() payload: CreateParticipantDto): Promise<Participant> {
    return this.participantService.create(payload)
  }
}
```

## Service Layer

### Best Practices

- Keep business logic in services, not controllers
- Services should be injectable and testable
- Use TypeORM entities for database operations
- Services handle data transformation and validation

### Example

```typescript
@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) {}

  async create(payload: CreateParticipantDto): Promise<Participant> {
    const participant = this.participantRepository.create(payload)
    return await this.participantRepository.save(participant)
  }

  async update(id: string, payload: UpdateParticipantDto): Promise<Participant> {
    await this.participantRepository.update(id, payload)
    return await this.findOne(id)
  }
}
```

## Error Handling

### Best Practices

- Use NestJS built-in exceptions (`BadRequestException`, `NotFoundException`, etc.)
- Avoid `console.log` for debugging in production code
- Return appropriate HTTP status codes
- Provide meaningful error messages

### Example

```typescript
async findOne(id: string): Promise<Participant> {
  const participant = await this.participantRepository.findOne({ where: { id } })
  
  if (!participant) {
    throw new NotFoundException(`Participant with ID ${id} not found`)
  }
  
  return participant
}
```

## DTOs and Validation

- Use DTOs (Data Transfer Objects) for request/response validation
- Use class-validator decorators for validation
- Keep DTOs in the same module or a shared location

### Example

```typescript
export class CreateParticipantDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string
}
```

## Instructions

1. **Controllers**: Use appropriate decorators, keep controllers thin (delegate to services)
2. **HTTP verbs**: Match frontend HTTP methods (PATCH for updates, not PUT)
3. **Guards**: Use guards for authentication/authorization, mark public endpoints
4. **Services**: Keep business logic in services, make them testable
5. **Error handling**: Use NestJS exceptions, avoid console.log in production
6. **DTOs**: Use DTOs with validation for request/response data
