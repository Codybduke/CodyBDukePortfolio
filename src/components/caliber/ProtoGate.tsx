import { useEffect, useState, type FormEvent } from 'react';
import SkillOnDeals from './SkillOnDeals';
import { Button } from './ui';

const KEY = 'caliber-proto-ok';
const HASH = '1d276fda1c26375ac5833a5c2aa52c2db1302452241b6d3e41988c667f364676';

async function digest(value: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Client-side lock for the public GitHub Pages URL. Not a substitute for a
 * real auth server — it keeps the walkthrough off casual visitors.
 */
export default function ProtoGate() {
  const [ready, setReady] = useState(false);
  const [ok, setOk] = useState(false);
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    setOk(sessionStorage.getItem(KEY) === '1');
    setReady(true);
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if ((await digest(value)) === HASH) {
      sessionStorage.setItem(KEY, '1');
      setOk(true);
      setWrong(false);
      return;
    }
    setWrong(true);
  };

  if (!ready) return <div className="cal-gate" aria-hidden="true" />;
  if (ok) return <SkillOnDeals />;

  return (
    <div className="cal-gate">
      <form className="cal-gate__card" onSubmit={submit}>
        <p className="cal-eyebrow">Caliber</p>
        <h1 className="cal-d20">Skill on Deals</h1>
        <p className="cal-b14 cal-muted">This prototype is private. Enter the password to continue.</p>
        <label className="cal-stack cal-gap-6">
          <span className="cal-label">Password</span>
          <input
            className="cal-gate__input"
            type="password"
            name="password"
            autoComplete="current-password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (wrong) setWrong(false);
            }}
          />
        </label>
        {wrong ? <p className="cal-b13" style={{ color: 'var(--cal-orange)' }}>That password is not right.</p> : null}
        <Button variant="primary" type="submit">Continue</Button>
      </form>
    </div>
  );
}
