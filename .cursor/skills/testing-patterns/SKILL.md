---
name: Testing Patterns
description: Jest testing guidelines, mocking strategies, and test structure patterns for unit tests.
---

# Testing Patterns

This skill provides testing guidelines and patterns for writing unit tests with Jest.

## When to Use

- When writing unit tests for components, services, or utilities
- When setting up test files and test suites
- When mocking dependencies and external services
- When testing async operations and error scenarios

## Test Framework

- Use Jest for all unit tests
- Follow the zoneless testing setup configured in the project
- Test components in isolation using mocks for dependencies

## Test Structure

### Service Testing Example

```typescript
describe('ParticipantService', () => {
  let service: ParticipantService
  let httpMock: jest.Mocked<HttpClient>

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>

    TestBed.configureTestingModule({
      providers: [
        ParticipantService,
        { provide: HttpClient, useValue: httpMock },
        { provide: Config, useValue: { api: { url: '/api' } } },
      ],
    })

    service = TestBed.inject(ParticipantService)
  })

  describe('getParticipants', () => {
    it('should return participants from API', async () => {
      const mockParticipants = [{ id: '1', name: 'Test Participant' }]
      httpMock.get.mockReturnValue(of(mockParticipants))

      const result = await service.getParticipants()

      expect(result).toEqual(mockParticipants)
      expect(httpMock.get).toHaveBeenCalledWith('/api/participants')
    })

    it('should handle errors', async () => {
      httpMock.get.mockReturnValue(throwError(() => new Error('Failed')))

      await expect(service.getParticipants()).rejects.toThrow('Failed')
    })
  })
})
```

## Mocking Best Practices

### External Dependencies

- Mock external dependencies (HTTP, services, config)
- Use `jest.fn()` for creating mock functions
- Provide mock implementations that match real behavior
- Reset mocks in `beforeEach` or `afterEach`

### Example

```typescript
beforeEach(() => {
  const configMock = {
    api: { url: '/api', auth: '/api/auth' },
  }

  TestBed.configureTestingModule({
    providers: [
      ParticipantService,
      { provide: HttpClient, useValue: httpMock },
      { provide: Config, useValue: configMock },
    ],
  })
})
```

## Component Testing

### Setup

- Use `TestBed` for component setup
- Import required Angular modules
- Mock child components and services
- Test component inputs and outputs

### Example

```typescript
describe('ParticipantListComponent', () => {
  let component: ParticipantListComponent
  let fixture: ComponentFixture<ParticipantListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantListComponent, MatTableModule],
      providers: [
        { provide: ParticipantService, useValue: mockParticipantService },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ParticipantListComponent)
    component = fixture.componentInstance
  })

  it('should display participants', () => {
    component.participants = [{ id: '1', name: 'Test' }]
    fixture.detectChanges()

    const rows = fixture.nativeElement.querySelectorAll('tr')
    expect(rows.length).toBeGreaterThan(0)
  })
})
```

## Async Testing

### Best Practices

- Use `async/await` for async tests
- Handle promises properly with `firstValueFrom` mocks
- Test error scenarios
- Use `fakeAsync` and `tick` when needed

### Example

```typescript
it('should handle async operations', async () => {
  const promise = service.getParticipants()

  await expect(promise).resolves.toEqual(mockParticipants)

  expect(httpMock.get).toHaveBeenCalledTimes(1)
})
```

## Test File Organization

### Location and Naming

- Place test files next to the files they test
- Use `.spec.ts` suffix for test files
- Example: `participant.service.ts` → `participant.service.spec.ts`

### Test Organization

- Group related tests with `describe` blocks
- Use descriptive test names that explain what is being tested
- Follow Arrange-Act-Assert pattern

### Example

```typescript
describe('ParticipantService', () => {
  describe('getParticipants', () => {
    it('should return participants from API', () => {
      // Arrange
      const mockParticipants = [{ id: '1', name: 'Test' }]
      httpMock.get.mockReturnValue(of(mockParticipants))

      // Act
      const result = await service.getParticipants()

      // Assert
      expect(result).toEqual(mockParticipants)
    })
  })
})
```

## Instructions

1. **Setup**: Use `TestBed` for Angular components, mock all dependencies
2. **Structure**: Group tests with `describe`, use descriptive names
3. **Mocking**: Mock external dependencies, reset mocks between tests
4. **Async**: Use `async/await`, test both success and error scenarios
5. **Location**: Place test files next to source files with `.spec.ts` suffix
6. **Pattern**: Follow Arrange-Act-Assert pattern for clarity
