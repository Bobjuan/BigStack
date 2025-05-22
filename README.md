# BigStack Poker

A modern poker training platform built with React and Vite, featuring real-time gameplay and interactive learning tools.

## Features

- Secure Authentication with Supabase
- 6-Max Cash Game with realistic table dynamics
- Interactive poker table with player positions
- Real-time game state management
- Protected routes and authenticated sessions
- Modern, responsive UI with TailwindCSS
- Interactive Quizzes (Coming Soon)
- Learning Resources (Coming Soon)

## Project Structure

```
/src
  /components        # Reusable React components
    /poker          # Poker game components
      /PokerGame    # Main poker game logic
      /PlayerHand   # Player hand display
      /Table        # Poker table components
    /common         # Common components (buttons, cards, etc.)
    /layout         # Layout components (header, footer, etc.)
    /auth          # Authentication components
  /pages            # Page components
    /auth          # Authentication pages
    /game          # Game pages
    /learn         # Learning pages
  /styles          # CSS and style files
  /assets          # Images, fonts, etc.
  /utils           # Utility functions
  /hooks           # Custom React hooks
  /context         # React Context providers
  /services        # API and service functions
  /config          # Configuration files
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Supabase:
   - Create a Supabase project
   - Copy your project URL and anon key
   - Create a `.env` file with:
     ```
     VITE_SUPABASE_URL=your_project_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Technology Stack

- React 18
- Vite
- Supabase (Authentication & Database)
- TailwindCSS
- PostCSS
- PokerSolver

## Recent Updates

- Implemented Supabase authentication with protected routes
- Added AuthContext for global auth state management
- Created responsive poker table layout
- Implemented 6-max cash game interface
- Added player positioning and hand display
- Integrated game state management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
