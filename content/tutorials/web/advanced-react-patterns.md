---
title: "Advanced React Patterns: Compound Components, Render Props, and Custom Hooks"
date: 2024-01-15T10:00:00Z
lastmod: 2024-01-15T10:00:00Z
draft: false
weight: 50
difficulty: "advanced"
duration: "90 minutes"
prerequisites:
  - "Strong understanding of React fundamentals"
  - "Experience with React Hooks"
  - "Knowledge of JavaScript ES6+"
objectives:
  - "Master compound component pattern"
  - "Implement flexible render prop components"
  - "Create reusable custom hooks"
  - "Understand performance optimization techniques"
resources:
  - name: "Source Code"
    url: "https://github.com/yourusername/react-patterns"
  - name: "Live Demo"
    url: "https://react-patterns-demo.netlify.app"
  - name: "Code Sandbox"
    url: "https://codesandbox.io/s/react-patterns"
summary: "Deep dive into advanced React patterns that enable building flexible, reusable, and maintainable component libraries."
tags: ["react", "javascript", "design-patterns", "hooks"]
categories: ["frontend", "react"]
technologies: ["react", "typescript"]
series: ["React Mastery"]
---

## Overview

{{< learning-objectives >}}

In this comprehensive tutorial, we'll explore advanced React patterns that professional developers use to build scalable applications. These patterns will transform how you think about component composition and state management.

## Prerequisites Check

{{< skill-check >}}
- [ ] React functional components
- [ ] useState and useEffect hooks
- [ ] Props and state management
- [ ] JavaScript destructuring and spread operator
{{< /skill-check >}}

## Pattern 1: Compound Components

Compound components allow you to create expressive and flexible APIs for your components. Think of how `<select>` and `<option>` work together in HTML.

{{< interactive-demo src="/demos/compound-components" height="600" >}}

### Implementation

{{< code-group >}}
```typescript {title="TypeScript"}
// Accordion.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AccordionContextType {
  activeIndex: number | null;
  onToggle: (index: number) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps {
  children: ReactNode;
  defaultIndex?: number | null;
}

export function Accordion({ children, defaultIndex = null }: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultIndex);
  
  const onToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  return (
    <AccordionContext.Provider value={{ activeIndex, onToggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  children: ReactNode;
  index: number;
}

export function AccordionItem({ children, index }: AccordionItemProps) {
  return (
    <div className="accordion-item" data-index={index}>
      {children}
    </div>
  );
}

interface AccordionHeaderProps {
  children: ReactNode;
  index: number;
}

export function AccordionHeader({ children, index }: AccordionHeaderProps) {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionHeader must be used within Accordion');
  }
  
  const { activeIndex, onToggle } = context;
  const isActive = activeIndex === index;
  
  return (
    <button
      className={`accordion-header ${isActive ? 'active' : ''}`}
      onClick={() => onToggle(index)}
      aria-expanded={isActive}
    >
      {children}
      <span className="accordion-icon">{isActive ? '−' : '+'}</span>
    </button>
  );
}

interface AccordionPanelProps {
  children: ReactNode;
  index: number;
}

export function AccordionPanel({ children, index }: AccordionPanelProps) {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionPanel must be used within Accordion');
  }
  
  const { activeIndex } = context;
  const isActive = activeIndex === index;
  
  return (
    <div
      className={`accordion-panel ${isActive ? 'active' : ''}`}
      hidden={!isActive}
    >
      {children}
    </div>
  );
}

// Usage
export default function App() {
  return (
    <Accordion defaultIndex={0}>
      <AccordionItem index={0}>
        <AccordionHeader index={0}>What is React?</AccordionHeader>
        <AccordionPanel index={0}>
          React is a JavaScript library for building user interfaces.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem index={1}>
        <AccordionHeader index={1}>Why use compound components?</AccordionHeader>
        <AccordionPanel index={1}>
          They provide a clean API and allow for flexible composition.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
// Accordion.js
import React, { createContext, useContext, useState } from 'react';

const AccordionContext = createContext();

export function Accordion({ children, defaultIndex = null }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  
  const onToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  return (
    <AccordionContext.Provider value={{ activeIndex, onToggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ children, index }) {
  return (
    <div className="accordion-item" data-index={index}>
      {children}
    </div>
  );
}

export function AccordionHeader({ children, index }) {
  const { activeIndex, onToggle } = useContext(AccordionContext);
  const isActive = activeIndex === index;
  
  return (
    <button
      className={`accordion-header ${isActive ? 'active' : ''}`}
      onClick={() => onToggle(index)}
      aria-expanded={isActive}
    >
      {children}
      <span className="accordion-icon">{isActive ? '−' : '+'}</span>
    </button>
  );
}

export function AccordionPanel({ children, index }) {
  const { activeIndex } = useContext(AccordionContext);
  const isActive = activeIndex === index;
  
  return (
    <div
      className={`accordion-panel ${isActive ? 'active' : ''}`}
      hidden={!isActive}
    >
      {children}
    </div>
  );
}
{{< /code-group >}}
{{< callout type="info" >}}
Pro Tip: Compound components shine when building component libraries. They provide intuitive APIs that other developers can easily understand and use.
{{< /callout >}}
Pattern 2: Render Props
The render prop pattern allows you to share code between components using a prop whose value is a function.
Classic Render Prop
tsxinterface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  render: (position: MousePosition) => ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return <>{render(position)}</>;
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <div>
      Mouse position: {x}, {y}
    </div>
  )}
/>
Children as a Function
tsxinterface DataFetcherProps<T> {
  url: string;
  children: (data: {
    loading: boolean;
    error: Error | null;
    data: T | null;
  }) => ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [state, setState] = useState<{
    loading: boolean;
    error: Error | null;
    data: T | null;
  }>({
    loading: true,
    error: null,
    data: null,
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setState({ loading: true, error: null, data: null });
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setState({ loading: false, error: null, data });
      } catch (error) {
        setState({ loading: false, error: error as Error, data: null });
      }
    };
    
    fetchData();
  }, [url]);
  
  return <>{children(state)}</>;
}
{{< exercise title="Exercise: Build a Toggle Render Prop" difficulty="intermediate" >}}
Create a Toggle component using the render prop pattern that:

Manages boolean state
Provides toggle, setOn, and setOff functions
Passes the state and controls via render prop

<details>
<summary>Solution</summary>
tsxinterface ToggleProps {
  defaultOn?: boolean;
  children: (props: {
    on: boolean;
    toggle: () => void;
    setOn: () => void;
    setOff: () => void;
  }) => ReactNode;
}

function Toggle({ defaultOn = false, children }: ToggleProps) {
  const [on, setOn] = useState(defaultOn);
  
  const toggle = () => setOn(prev => !prev);
  const handleSetOn = () => setOn(true);
  const handleSetOff = () => setOn(false);
  
  return (
    <>
      {children({
        on,
        toggle,
        setOn: handleSetOn,
        setOff: handleSetOff,
      })}
    </>
  );
}

// Usage
<Toggle>
  {({ on, toggle }) => (
    <button onClick={toggle}>
      {on ? 'ON' : 'OFF'}
    </button>
  )}
</Toggle>
</details>
{{< /exercise >}}
Pattern 3: Custom Hooks
Custom hooks are the most powerful pattern for sharing stateful logic between components.
useLocalStorage Hook
tsxfunction useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Save state
      setStoredValue(valueToStore);
      
      // Dispatch a custom event so other components using this hook are updated
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // this only works for other documents, not the current one
    window.addEventListener('storage', handleStorageChange);
    
    // this is a custom event, triggered in setValue
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, []);

  return [storedValue, setValue];
}
useDebounce Hook
tsxfunction useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
useIntersectionObserver Hook
tsxinterface UseIntersectionObserverProps extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: UseIntersectionObserverProps = {}
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    const node = elementRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin, frozen]);

  return entry;
}

// Usage: Lazy load images
function LazyImage({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const imgRef = useRef<HTMLImageElement>(null);
  const entry = useIntersectionObserver(imgRef, { 
    threshold: 0.1,
    rootMargin: '50px',
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (entry?.isIntersecting && !loaded) {
      const img = new Image();
      img.src = src!;
      img.onload = () => setLoaded(true);
    }
  }, [entry?.isIntersecting, src, loaded]);

  return (
    <div ref={imgRef} className="lazy-image-wrapper">
      {loaded ? (
        <img src={src} alt={alt} {...props} />
      ) : (
        <div className="lazy-image-placeholder" />
      )}
    </div>
  );
}
{{< callout type="warning" >}}
Performance Note: Always memoize expensive computations in custom hooks using useMemo and callbacks with useCallback to prevent unnecessary re-renders.
{{< /callout >}}
Pattern 4: State Reducer Pattern
The state reducer pattern gives users more control over state management.
tsx// Types
interface State {
  count: number;
}

type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'set'; payload: number };

// Default reducer
function defaultReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    case 'set':
      return { count: action.payload };
    default:
      return state;
  }
}

interface UseCounterProps {
  initialCount?: number;
  reducer?: (state: State, action: Action) => State;
}

function useCounter({ 
  initialCount = 0, 
  reducer = defaultReducer 
}: UseCounterProps = {}) {
  const [state, dispatch] = useReducer(reducer, { count: initialCount });

  const increment = () => dispatch({ type: 'increment' });
  const decrement = () => dispatch({ type: 'decrement' });
  const reset = () => dispatch({ type: 'reset' });
  const set = (count: number) => dispatch({ type: 'set', payload: count });

  return {
    count: state.count,
    increment,
    decrement,
    reset,
    set,
  };
}

// Usage with custom reducer
function App() {
  const counter = useCounter({
    initialCount: 0,
    reducer: (state, action) => {
      // Custom logic: max count of 10
      const newState = defaultReducer(state, action);
      return {
        count: Math.min(newState.count, 10)
      };
    }
  });

  return (
    <div>
      <p>Count: {counter.count}</p>
      <button onClick={counter.increment}>+</button>
      <button onClick={counter.decrement}>-</button>
      <button onClick={counter.reset}>Reset</button>
    </div>
  );
}
Performance Optimization Patterns
Memoization with useMemo and useCallback
tsxfunction ExpensiveComponent({ data, onItemClick }: Props) {
  // Memoize expensive computation
  const processedData = useMemo(() => {
    return data
      .filter(item => item.active)
      .sort((a, b) => b.priority - a.priority)
      .map(item => ({
        ...item,
        displayName: `${item.name} (${item.category})`,
      }));
  }, [data]);

  // Memoize callback to prevent child re-renders
  const handleClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <div>
      {processedData.map(item => (
        <Item 
          key={item.id} 
          item={item} 
          onClick={handleClick}
        />
      ))}
    </div>
  );
}
Code Splitting with React.lazy
tsxconst HeavyComponent = lazy(() => 
  import(/* webpackChunkName: "heavy-component" */ './HeavyComponent')
);

function App() {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <div>
      <button onClick={() => setShowHeavy(true)}>
        Load Heavy Component
      </button>
      
      {showHeavy && (
        <Suspense fallback={<Spinner />}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
Testing Patterns
{{< code-group >}}
tsximport { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('should use custom reducer', () => {
    const { result } = renderHook(() => 
      useCounter({
        reducer: (state, action) => {
          const newState = defaultReducer(state, action);
          return { count: Math.min(newState.count, 5) };
        }
      })
    );

    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.increment();
      }
    });

    expect(result.current.count).toBe(5);
  });
});
tsximport { render, screen, fireEvent } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel } from './Accordion';

describe('Accordion', () => {
  it('should toggle panels', () => {
    render(
      <Accordion>
        <AccordionItem index={0}>
          <AccordionHeader index={0}>Header 1</AccordionHeader>
          <AccordionPanel index={0}>Panel 1</AccordionPanel>
        </AccordionItem>
        <AccordionItem index={1}>
          <AccordionHeader index={1}>Header 2</AccordionHeader>
          <AccordionPanel index={1}>Panel 2</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );

    const header1 = screen.getByText('Header 1');
    const panel1 = screen.getByText('Panel 1');

    expect(panel1).not.toBeVisible();

    fireEvent.click(header1);
    expect(panel1).toBeVisible();

    fireEvent.click(header1);
    expect(panel1).not.toBeVisible();
  });
});
{{< /code-group >}}
Real-World Example: Building a Data Table
Let's combine these patterns to build a flexible data table component:
{{< interactive-demo src="/demos/advanced-data-table" height="800" >}}
tsx// DataTable with all patterns combined
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  renderRow?: (item: T, index: number) => ReactNode;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
  error?: Error | null;
}

function DataTable<T extends Record<string, any>>({ 
  data, 
  columns,
  renderRow,
  onSort,
  loading,
  error
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    column: string | null;
    direction: 'asc' | 'desc';
  }>({ column: null, direction: 'asc' });
  
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  // Custom hook for pagination
  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
  } = usePagination(data, { defaultPageSize: 10 });
  
  // Memoized sorted data
  const sortedData = useMemo(() => {
    if (!sortConfig.column) return paginatedData;
    
    return [...paginatedData].sort((a, b) => {
      const aVal = a[sortConfig.column!];
      const bVal = b[sortConfig.column!];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [paginatedData, sortConfig]);
  
  const handleSort = (column: string) => {
    const direction = 
      sortConfig.column === column && sortConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc';
    
    setSortConfig({ column, direction });
    onSort?.(column, direction);
  };
  
  if (loading) return <TableSkeleton />;
  if (error) return <TableError error={error} />;
  
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRows(new Set(data.map(d => d.id)));
                  } else {
                    setSelectedRows(new Set());
                  }
                }}
              />
            </th>
            {columns.map(column => (
              <th key={column.key}>
                <button
                  className="sort-button"
                  onClick={() => handleSort(column.key)}
                >
                  {column.header}
                  {sortConfig.column === column.key && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            renderRow ? renderRow(item, index) : (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(item.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedRows);
                      if (e.target.checked) {
                        newSelected.add(item.id);
                      } else {
                        newSelected.delete(item.id);
                      }
                      setSelectedRows(newSelected);
                    }}
                  />
                </td>
                {columns.map(column => (
                  <td key={column.key}>
                    {column.render 
                      ? column.render(item[column.key], item) 
                      : item[column.key]
                    }
                  </td>
                ))}
              </tr>
            )
          ))}
        </tbody>
      </table>
      
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}