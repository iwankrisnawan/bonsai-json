import { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { JsonEditor } from './components/JsonEditor';
import { ControlPanel } from './components/ControlPanel';
import { tryShortenJson } from './utils/jsonShortener';
import { useDebounce } from './hooks/useDebounce';

const PLACEHOLDER = `{
  "meta": {
    "source": "https://api.example.com/v2/users",
    "requestId": "req_abc123def456",
    "timestamp": "2025-12-01T14:32:10.123Z",
    "version": "2.0"
  },
  "status": "ok",
  "code": 200,
  "pagination": {
    "page": 1,
    "perPage": 50,
    "totalPages": 42,
    "totalItems": 2083,
    "hasNext": true,
    "hasPrev": false
  },
  "data": {
    "users": [
      {
        "id": "usr_001",
        "username": "alice_j",
        "email": "alice@example.com",
        "age": 31,
        "isActive": true,
        "balance": 2450.75,
        "registered": "2023-04-12T08:30:00.000Z",
        "profile": {
          "displayName": "Alice Johnson",
          "avatar": "https://cdn.example.com/avatars/usr_001.png",
          "bio": "Senior frontend developer passionate about React and TypeScript. Loves open source.",
          "location": "San Francisco, CA",
          "website": "https://alice.dev",
          "memberSince": "2023-04-12",
          "isVerified": true,
          "followers": 1523,
          "following": 347
        },
        "preferences": {
          "theme": "dark",
          "notifications": { "email": true, "push": false, "sms": false },
          "language": "en-US",
          "timezone": "America/Los_Angeles"
        },
        "roles": ["admin", "editor", "moderator"],
        "metadata": null
      },
      {
        "id": "usr_002",
        "username": "bob_dev",
        "email": "bob@example.com",
        "age": 28,
        "isActive": true,
        "balance": 1890.5,
        "registered": "2023-06-22T10:15:00.000Z",
        "profile": {
          "displayName": "Bob Williams",
          "avatar": "https://cdn.example.com/avatars/usr_002.png",
          "bio": "Backend engineer specializing in distributed systems and microservices.",
          "location": "New York, NY",
          "website": "https://bobwil.dev",
          "memberSince": "2023-06-22",
          "isVerified": true,
          "followers": 892,
          "following": 156
        },
        "preferences": {
          "theme": "light",
          "notifications": { "email": true, "push": true, "sms": false },
          "language": "en-US",
          "timezone": "America/New_York"
        },
        "roles": ["developer"],
        "metadata": { "department": "engineering", "level": "senior" }
      },
      {
        "id": "usr_003",
        "username": "carol_d",
        "email": "carol@example.com",
        "age": 26,
        "isActive": false,
        "balance": 3420.0,
        "registered": "2024-01-10T16:45:00.000Z",
        "profile": {
          "displayName": "Carol Davis",
          "avatar": "https://cdn.example.com/avatars/usr_003.png",
          "bio": "UX designer and frontend developer. Accessibility advocate.",
          "location": "Austin, TX",
          "website": "https://carold.design",
          "memberSince": "2024-01-10",
          "isVerified": false,
          "followers": 2341,
          "following": 589
        },
        "preferences": {
          "theme": "dark",
          "notifications": { "email": false, "push": true, "sms": true },
          "language": "en-US",
          "timezone": "America/Chicago"
        },
        "roles": ["designer", "contributor"],
        "metadata": null
      },
      {
        "id": "usr_004",
        "username": "david_m",
        "email": "david@example.com",
        "age": 35,
        "isActive": true,
        "balance": 5100.25,
        "registered": "2022-09-05T12:00:00.000Z",
        "profile": {
          "displayName": "David Martinez",
          "avatar": "https://cdn.example.com/avatars/usr_004.png",
          "bio": "DevOps engineer. Kubernetes enthusiast. Coffee addict.",
          "location": "Seattle, WA",
          "website": "https://davidm.io",
          "memberSince": "2022-09-05",
          "isVerified": true,
          "followers": 678,
          "following": 234
        },
        "preferences": {
          "theme": "dark",
          "notifications": { "email": true, "push": true, "sms": true },
          "language": "en-US",
          "timezone": "America/Los_Angeles"
        },
        "roles": ["admin", "devops"],
        "metadata": { "department": "infrastructure", "level": "staff" }
      },
      {
        "id": "usr_005",
        "username": "emma_s",
        "email": "emma@example.com",
        "age": 29,
        "isActive": true,
        "balance": 2780.4,
        "registered": "2023-11-18T09:30:00.000Z",
        "profile": {
          "displayName": "Emma Smith",
          "avatar": "https://cdn.example.com/avatars/usr_005.png",
          "bio": "Data scientist and Python developer. Machine learning enthusiast.",
          "location": "Chicago, IL",
          "website": "https://emmasmith.dev",
          "memberSince": "2023-11-18",
          "isVerified": true,
          "followers": 3456,
          "following": 421
        },
        "preferences": {
          "theme": "light",
          "notifications": { "email": true, "push": false, "sms": false },
          "language": "en-US",
          "timezone": "America/Chicago"
        },
        "roles": ["developer", "data-science"],
        "metadata": null
      },
      {
        "id": "usr_006",
        "username": "frank_t",
        "email": "frank@example.com",
        "age": 42,
        "isActive": false,
        "balance": 8900.0,
        "registered": "2021-03-20T07:00:00.000Z",
        "profile": {
          "displayName": "Frank Thompson",
          "avatar": "https://cdn.example.com/avatars/usr_006.png",
          "bio": "Engineering manager. Golang and systems programming.",
          "location": "Portland, OR",
          "website": null,
          "memberSince": "2021-03-20",
          "isVerified": true,
          "followers": 4567,
          "following": 123
        },
        "preferences": {
          "theme": "dark",
          "notifications": { "email": true, "push": true, "sms": false },
          "language": "en-US",
          "timezone": "America/Los_Angeles"
        },
        "roles": ["admin", "manager"],
        "metadata": { "department": "engineering", "level": "director" }
      },
      {
        "id": "usr_007",
        "username": "grace_k",
        "email": "grace@example.com",
        "age": 24,
        "isActive": true,
        "balance": 1560.3,
        "registered": "2024-05-08T14:20:00.000Z",
        "profile": {
          "displayName": "Grace Kim",
          "avatar": "https://cdn.example.com/avatars/usr_007.png",
          "bio": "Junior developer learning React and TypeScript. Bootcamp graduate.",
          "location": "Los Angeles, CA",
          "website": "https://gracekim.dev",
          "memberSince": "2024-05-08",
          "isVerified": false,
          "followers": 345,
          "following": 678
        },
        "preferences": {
          "theme": "light",
          "notifications": { "email": true, "push": true, "sms": true },
          "language": "en-US",
          "timezone": "America/Los_Angeles"
        },
        "roles": ["developer", "junior"],
        "metadata": null
      },
      {
        "id": "usr_008",
        "username": "henry_n",
        "email": "henry@example.com",
        "age": 38,
        "isActive": true,
        "balance": 7200.6,
        "registered": "2022-06-30T11:10:00.000Z",
        "profile": {
          "displayName": "Henry Nguyen",
          "avatar": "https://cdn.example.com/avatars/usr_008.png",
          "bio": "Full-stack developer. React, Node.js, and PostgreSQL.",
          "location": "Denver, CO",
          "website": "https://henryng.dev",
          "memberSince": "2022-06-30",
          "isVerified": true,
          "followers": 2100,
          "following": 345
        },
        "preferences": {
          "theme": "dark",
          "notifications": { "email": true, "push": false, "sms": false },
          "language": "en-US",
          "timezone": "America/Denver"
        },
        "roles": ["developer", "senior"],
        "metadata": { "department": "engineering", "level": "senior" }
      },
      {
        "id": "usr_009",
        "username": "isabella_o",
        "email": "isabella@example.com",
        "age": 33,
        "isActive": true,
        "balance": 4500.0,
        "registered": "2023-02-14T13:45:00.000Z",
        "profile": {
          "displayName": "Isabella Ortiz",
          "avatar": "https://cdn.example.com/avatars/usr_009.png",
          "bio": "Product manager turned developer. Building the future of fintech.",
          "location": "Miami, FL",
          "website": "https://isabellaortiz.dev",
          "memberSince": "2023-02-14",
          "isVerified": true,
          "followers": 1876,
          "following": 890
        },
        "preferences": {
          "theme": "light",
          "notifications": { "email": true, "push": true, "sms": true },
          "language": "en-US",
          "timezone": "America/New_York"
        },
        "roles": ["product", "developer"],
        "metadata": null
      },
      {
        "id": "usr_010",
        "username": "jack_p",
        "email": "jack@example.com",
        "age": 45,
        "isActive": false,
        "balance": 12300.0,
        "registered": "2020-07-04T08:00:00.000Z",
        "profile": {
          "displayName": "Jack Peterson",
          "avatar": "https://cdn.example.com/avatars/usr_010.png",
          "bio": "CTO and co-founder. 20 years of experience in tech.",
          "location": "San Jose, CA",
          "website": "https://jackp.io",
          "memberSince": "2020-07-04",
          "isVerified": true,
          "followers": 12890,
          "following": 234
        },
        "preferences": {
          "theme": "dark",
          "notifications": { "email": false, "push": false, "sms": false },
          "language": "en-US",
          "timezone": "America/Los_Angeles"
        },
        "roles": ["admin", "executive"],
        "metadata": { "department": "executive", "level": "cto" }
      },
      {
        "id": "usr_011",
        "username": "kate_r",
        "email": "kate@example.com",
        "age": 27,
        "isActive": true,
        "balance": 3200.8,
        "registered": "2023-09-01T15:30:00.000Z",
        "profile": {
          "displayName": "Kate Roberts",
          "avatar": "https://cdn.example.com/avatars/usr_011.png",
          "bio": "Mobile developer. React Native and Flutter. Loves hiking.",
          "location": "Boulder, CO",
          "website": "https://kater.dev",
          "memberSince": "2023-09-01",
          "isVerified": true,
          "followers": 1567,
          "following": 432
        },
        "preferences": {
          "theme": "dark",
          "notifications": { "email": true, "push": false, "sms": true },
          "language": "en-US",
          "timezone": "America/Denver"
        },
        "roles": ["developer", "mobile"],
        "metadata": null
      },
      {
        "id": "usr_012",
        "username": "liam_c",
        "email": "liam@example.com",
        "age": 30,
        "isActive": true,
        "balance": 5600.0,
        "registered": "2022-12-10T10:00:00.000Z",
        "profile": {
          "displayName": "Liam Chen",
          "avatar": "https://cdn.example.com/avatars/usr_012.png",
          "bio": "Platform engineer. Rust and WebAssembly enthusiast.",
          "location": "San Francisco, CA",
          "website": "https://liamchen.tech",
          "memberSince": "2022-12-10",
          "isVerified": true,
          "followers": 2890,
          "following": 567
        },
        "preferences": {
          "theme": "dark",
          "notifications": { "email": true, "push": true, "sms": false },
          "language": "en-US",
          "timezone": "America/Los_Angeles"
        },
        "roles": ["developer", "platform"],
        "metadata": { "department": "engineering", "level": "senior" }
      },
      {
        "id": "usr_013",
        "username": "mia_w",
        "email": "mia@example.com",
        "age": 22,
        "isActive": true,
        "balance": 980.5,
        "registered": "2024-08-19T12:00:00.000Z",
        "profile": {
          "displayName": "Mia Wilson",
          "avatar": "https://cdn.example.com/avatars/usr_013.png",
          "bio": "Fresh graduate. Excited to start my career in tech!",
          "location": "Atlanta, GA",
          "website": null,
          "memberSince": "2024-08-19",
          "isVerified": false,
          "followers": 123,
          "following": 456
        },
        "preferences": {
          "theme": "light",
          "notifications": { "email": true, "push": true, "sms": true },
          "language": "en-US",
          "timezone": "America/New_York"
        },
        "roles": ["developer", "junior"],
        "metadata": null
      },
      {
        "id": "usr_014",
        "username": "noah_b",
        "email": "noah@example.com",
        "age": 39,
        "isActive": true,
        "balance": 8900.0,
        "registered": "2021-08-25T09:15:00.000Z",
        "profile": {
          "displayName": "Noah Brown",
          "avatar": "https://cdn.example.com/avatars/usr_014.png",
          "bio": "Security engineer. Penetration testing and compliance.",
          "location": "Washington, DC",
          "website": "https://noahbrown.sec",
          "memberSince": "2021-08-25",
          "isVerified": true,
          "followers": 5678,
          "following": 789
        },
        "preferences": {
          "theme": "dark",
          "notifications": { "email": false, "push": false, "sms": false },
          "language": "en-US",
          "timezone": "America/New_York"
        },
        "roles": ["admin", "security"],
        "metadata": { "department": "security", "level": "staff" }
      },
      {
        "id": "usr_015",
        "username": "olivia_a",
        "email": "olivia@example.com",
        "age": 34,
        "isActive": false,
        "balance": 4300.2,
        "registered": "2022-04-03T11:30:00.000Z",
        "profile": {
          "displayName": "Olivia Anderson",
          "avatar": "https://cdn.example.com/avatars/usr_015.png",
          "bio": "Technical writer and developer advocate. Making complex topics simple.",
          "location": "Raleigh, NC",
          "website": "https://oliviaa.dev",
          "memberSince": "2022-04-03",
          "isVerified": true,
          "followers": 7890,
          "following": 890
        },
        "preferences": {
          "theme": "light",
          "notifications": { "email": true, "push": true, "sms": false },
          "language": "en-US",
          "timezone": "America/New_York"
        },
        "roles": ["writer", "advocate"],
        "metadata": null
      },
      {
        "id": "usr_016",
        "username": "james_l",
        "email": "james@example.com",
        "age": 41,
        "isActive": true,
        "balance": 15000.0,
        "registered": "2020-01-15T08:00:00.000Z",
        "profile": {
          "displayName": "James Lee",
          "avatar": "https://cdn.example.com/avatars/usr_016.png",
          "bio": "Principal architect. Designing scalable cloud solutions.",
          "location": "Seattle, WA",
          "website": "https://jameslee.arch",
          "memberSince": "2020-01-15",
          "isVerified": true,
          "followers": 10234,
          "following": 456
        },
        "preferences": {
          "theme": "dark",
          "notifications": { "email": true, "push": false, "sms": false },
          "language": "en-US",
          "timezone": "America/Los_Angeles"
        },
        "roles": ["admin", "architect"],
        "metadata": { "department": "engineering", "level": "principal" }
      },
      {
        "id": "usr_017",
        "username": "sophia_g",
        "email": "sophia@example.com",
        "age": 25,
        "isActive": true,
        "balance": 2100.0,
        "registered": "2024-02-28T14:00:00.000Z",
        "profile": {
          "displayName": "Sophia Garcia",
          "avatar": "https://cdn.example.com/avatars/usr_017.png",
          "bio": "Frontend developer. CSS artist and animation lover.",
          "location": "Phoenix, AZ",
          "website": "https://sophiag.design",
          "memberSince": "2024-02-28",
          "isVerified": true,
          "followers": 2345,
          "following": 678
        },
        "preferences": {
          "theme": "dark",
          "notifications": { "email": true, "push": true, "sms": false },
          "language": "en-US",
          "timezone": "America/Phoenix"
        },
        "roles": ["developer", "frontend"],
        "metadata": null
      },
      {
        "id": "usr_018",
        "username": "ethan_m",
        "email": "ethan@example.com",
        "age": 36,
        "isActive": false,
        "balance": 6700.0,
        "registered": "2021-11-11T10:30:00.000Z",
        "profile": {
          "displayName": "Ethan Miller",
          "avatar": "https://cdn.example.com/avatars/usr_018.png",
          "bio": "QA engineer and automation specialist. Selenium and Playwright.",
          "location": "Dallas, TX",
          "website": null,
          "memberSince": "2021-11-11",
          "isVerified": true,
          "followers": 1234,
          "following": 345
        },
        "preferences": {
          "theme": "light",
          "notifications": { "email": true, "push": false, "sms": true },
          "language": "en-US",
          "timezone": "America/Chicago"
        },
        "roles": ["developer", "qa"],
        "metadata": { "department": "quality", "level": "senior" }
      },
      {
        "id": "usr_019",
        "username": "ava_t",
        "email": "ava@example.com",
        "age": 32,
        "isActive": true,
        "balance": 3900.0,
        "registered": "2023-05-20T16:00:00.000Z",
        "profile": {
          "displayName": "Ava Taylor",
          "avatar": "https://cdn.example.com/avatars/usr_019.png",
          "bio": "Cloud architect. AWS and GCP certified. Serverless advocate.",
          "location": "Boston, MA",
          "website": "https://avataylor.cloud",
          "memberSince": "2023-05-20",
          "isVerified": true,
          "followers": 4567,
          "following": 567
        },
        "preferences": {
          "theme": "dark",
          "notifications": { "email": true, "push": true, "sms": false },
          "language": "en-US",
          "timezone": "America/New_York"
        },
        "roles": ["admin", "architect"],
        "metadata": { "department": "engineering", "level": "staff" }
      },
      {
        "id": "usr_020",
        "username": "liam_w",
        "email": "liam.w@example.com",
        "age": 37,
        "isActive": true,
        "balance": 7800.5,
        "registered": "2022-02-14T07:45:00.000Z",
        "profile": {
          "displayName": "Liam Walker",
          "avatar": "https://cdn.example.com/avatars/usr_020.png",
          "bio": "Site reliability engineer. Monitoring and observability.",
          "location": "Minneapolis, MN",
          "website": "https://liamw.sre",
          "memberSince": "2022-02-14",
          "isVerified": true,
          "followers": 3456,
          "following": 234
        },
        "preferences": {
          "theme": "dark",
          "notifications": { "email": true, "push": true, "sms": true },
          "language": "en-US",
          "timezone": "America/Chicago"
        },
        "roles": ["developer", "sre"],
        "metadata": { "department": "infrastructure", "level": "senior" }
      }
    ]
  }
}`;

export default function App() {
  const [input, setInput] = useState(PLACEHOLDER);
  const [output, setOutput] = useState('');
  const [maxItems, setMaxItems] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [autoShorten, setAutoShorten] = useState(true);

  const debouncedInput = useDebounce(input, 500);

  const shorten = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    const result = tryShortenJson(input, maxItems);
    if (result.ok) {
      setOutput(result.value);
      setError(null);
    } else {
      setError(result.error);
      setOutput('');
    }
  }, [input, maxItems]);

  // Initial shorten on mount
  useEffect(() => {
    shorten();
  }, []);

  // Auto-shorten on debounced input or maxItems change
  useEffect(() => {
    if (autoShorten && debouncedInput.trim()) {
      const result = tryShortenJson(debouncedInput, maxItems);
      if (result.ok) {
        setOutput(result.value);
        setError(null);
      } else {
        setError(result.error);
        setOutput('');
      }
    }
  }, [debouncedInput, maxItems, autoShorten]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
    setCopied(false);
  }, []);

  return (
    <div className="h-dvh flex flex-col bg-zinc-950 text-zinc-100">
      <Header />

      <ControlPanel
        maxItems={maxItems}
        onMaxItemsChange={setMaxItems}
        onShorten={shorten}
        onCopy={handleCopy}
        onClear={handleClear}
        copied={copied}
        autoShorten={autoShorten}
        onAutoShortenChange={setAutoShorten}
        hasInput={input.trim().length > 0}
        hasOutput={output.length > 0}
      />

      {/* Editors */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        <div className="flex-1 min-h-0 lg:w-1/2">
          <JsonEditor
            label="INPUT"
            value={input}
            onChange={setInput}
            placeholder="Paste your JSON here..."
          />
        </div>

        <div className="editor-divider" />

        <div className="flex-1 min-h-0 lg:w-1/2">
          <JsonEditor
            label="OUTPUT"
            value={output}
            readOnly
            placeholder="Shortened JSON will appear here..."
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
