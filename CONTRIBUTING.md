# Contributing to Blipee OS

Thank you for your interest in contributing to Blipee OS! We're building the future of AI-powered sustainability management, and we'd love your help.

## 🌟 Ways to Contribute

### 1. Code Contributions
- Fix bugs or implement new features
- Improve performance or security
- Add device integrations
- Enhance AI capabilities

### 2. Documentation
- Improve guides and tutorials
- Add examples and use cases
- Translate documentation
- Fix typos or clarify instructions

### 3. Testing & Quality
- Report bugs with detailed information
- Write unit or integration tests
- Perform security audits
- Test on different devices/browsers

### 4. Design & UX
- Propose UI/UX improvements
- Create mockups or prototypes
- Improve accessibility
- Design new themes

### 5. Community
- Answer questions in issues
- Share your use cases
- Write blog posts or tutorials
- Help other users get started

## 🚀 Getting Started

### Prerequisites
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/blipee-os.git`
3. Set up the development environment (see [Getting Started Guide](./docs/setup/GETTING_STARTED.md))
4. Create a new branch: `git checkout -b feature/your-feature-name`

### Development Workflow
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests before committing
npm test
npm run lint
npm run type-check

# Build to verify production works
npm run build
```

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript strict mode
- Avoid `any` types - use `unknown` or proper types
- Document complex types with JSDoc comments
- Prefer interfaces over type aliases for objects

### React & Next.js
- Use functional components with hooks
- Follow React best practices and conventions
- Keep components small and focused
- Use proper prop types and default values

### Material UI
- Follow Material Design 3 guidelines
- Use theme colors instead of hardcoded values
- Ensure components work in both light/dark modes
- Maintain consistent spacing and typography

### Code Quality
```typescript
// ✅ Good
export function calculateEnergySavings(
  currentUsage: number,
  optimizedUsage: number
): number {
  return currentUsage - optimizedUsage;
}

// ❌ Bad
export function calc(curr: any, opt: any) {
  return curr - opt;
}
```

### AI Integration
- Keep prompts clear and concise
- Handle all AI provider errors gracefully
- Include fallback behavior when AI is unavailable
- Test with multiple providers (DeepSeek, OpenAI, Anthropic)

## 🔄 Pull Request Process

### 1. Before Submitting
- [ ] Test your changes thoroughly
- [ ] Update documentation if needed
- [ ] Add tests for new functionality
- [ ] Ensure all tests pass
- [ ] Run linting and type checking
- [ ] Update CHANGELOG.md if applicable

### 2. PR Guidelines
- **Title**: Use conventional commits format
  - `feat:` New feature
  - `fix:` Bug fix
  - `docs:` Documentation changes
  - `style:` Code style changes
  - `refactor:` Code refactoring
  - `test:` Test additions/changes
  - `chore:` Maintenance tasks

- **Description**: Include:
  - What changes were made
  - Why they were necessary
  - How to test the changes
  - Screenshots for UI changes
  - Related issue numbers

### 3. Example PR
```markdown
## feat: Add energy usage predictions to dashboard

### Changes
- Added predictive analytics component
- Integrated with AI service for predictions
- Updated dashboard layout to show predictions
- Added tests for prediction calculations

### Why
Users requested the ability to see predicted energy usage to better plan their consumption and identify potential savings.

### Testing
1. Go to the dashboard
2. Look for the new "Predictions" card
3. Verify predictions update in real-time
4. Test with different time ranges

### Screenshots
[Include screenshots here]

Fixes #123
```

## 🐛 Reporting Issues

### Bug Reports Should Include:
1. **Description**: Clear explanation of the problem
2. **Steps to Reproduce**: Detailed steps to recreate the issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**:
   - Browser and version
   - Operating system
   - Device type (desktop/mobile)
   - Blipee OS version
6. **Screenshots/Logs**: If applicable
7. **Additional Context**: Any other relevant information

### Feature Requests Should Include:
1. **Problem Statement**: What problem does this solve?
2. **Proposed Solution**: How would you implement it?
3. **Alternatives**: Other ways to solve the problem
4. **Use Cases**: Real-world examples
5. **Mockups**: Visual representations (optional)

## 🏗️ Project Structure

```
src/
├── app/                # Next.js App Router pages
├── components/         # React components
│   ├── ai/            # AI-related components
│   ├── devices/       # Device management
│   ├── ui/            # Reusable UI components
│   └── ...
├── lib/               # Core libraries
│   ├── ai/           # AI service layer
│   ├── supabase/     # Database client
│   └── ...
├── types/             # TypeScript definitions
└── styles/            # Global styles
```

## 🧪 Testing Guidelines

### Unit Tests
```typescript
// Example test for a utility function
describe('calculateEnergySavings', () => {
  it('should calculate savings correctly', () => {
    expect(calculateEnergySavings(100, 80)).toBe(20);
  });
  
  it('should handle zero values', () => {
    expect(calculateEnergySavings(0, 0)).toBe(0);
  });
});
```

### Integration Tests
- Test API endpoints with different scenarios
- Verify database operations work correctly
- Test AI integrations with mock responses

### E2E Tests
- Test complete user workflows
- Verify critical paths work end-to-end
- Test on multiple browsers/devices

## 🔐 Security Guidelines

1. **Never commit secrets**: API keys, passwords, tokens
2. **Validate all inputs**: Both client and server-side
3. **Use parameterized queries**: Prevent SQL injection
4. **Implement proper auth**: Check permissions on all routes
5. **Report vulnerabilities**: Email security@blipee.com

## 📚 Resources

### Documentation
- [Project Documentation](./docs/)
- [API Reference](/api-docs)
- [Material Design 3](https://m3.material.io/)
- [Next.js Documentation](https://nextjs.org/docs)

### Community
- GitHub Issues: Questions and discussions
- Discord: Coming soon!
- Twitter: [@blipee_dev](https://twitter.com/blipee_dev)

## 🎯 Development Principles

1. **User-Centric**: Always prioritize user experience
2. **AI-First**: Leverage AI to simplify complex tasks
3. **Performance**: Keep the app fast and responsive
4. **Accessibility**: Ensure everyone can use Blipee OS
5. **Security**: Protect user data and privacy
6. **Sustainability**: Our code should reflect our mission

## 📄 License

By contributing to Blipee OS, you agree that your contributions will be licensed under the same license as the project.

## 🙏 Thank You!

Every contribution, no matter how small, helps make Blipee OS better. We appreciate your time and effort in improving our platform.

If you have any questions, feel free to:
- Open an issue for discussion
- Ask in our community channels
- Email us at developers@blipee.com

Happy coding! 🚀

---

**Remember**: Great software is built by great communities. Welcome to ours!