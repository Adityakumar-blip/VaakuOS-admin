import React from 'react';
import { Sun, Moon, Languages, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { availablePalettes } from '@/config/settings-registry';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Settings() {
  const { theme, setTheme, palette, setPalette, direction, setDirection } = useTheme();

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize your admin panel appearance and preferences.
        </p>
      </div>

      {/* Theme Section */}
      <section className="bg-card rounded-xl border border-border p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-foreground mb-4">Appearance</h2>

        {/* Theme Toggle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              <div>
                <Label className="text-base font-medium">Theme</Label>
                <p className="text-sm text-muted-foreground">Choose light or dark mode</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  theme === 'light'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  theme === 'dark'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Direction Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Languages size={20} />
              <div>
                <Label className="text-base font-medium">Text Direction</Label>
                <p className="text-sm text-muted-foreground">Switch between LTR and RTL</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDirection('ltr')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  direction === 'ltr'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                LTR
              </button>
              <button
                onClick={() => setDirection('rtl')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  direction === 'rtl'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                RTL
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette Section */}
      <section className="bg-card rounded-xl border border-border p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-foreground mb-4">Color Palette</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Choose your brand color. This will update the entire UI.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {availablePalettes.map((p) => (
            <button
              key={p.id}
              onClick={() => setPalette(p.id)}
              className={cn(
                'relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                palette === p.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30'
              )}
            >
              <style dangerouslySetInnerHTML={{ __html: `.palette-preview-${p.id} { background-color: hsl(${p.hsl}); }` }} />
              <div
                className={`w-10 h-10 rounded-full shrink-0 palette-preview-${p.id}`}
              />
              <span className="font-medium text-foreground">{p.label}</span>
              {palette === p.id && (
                <Check
                  size={18}
                  className="absolute top-2 right-2 text-primary"
                />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Preview */}
      <section className="bg-card rounded-xl border border-border p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-foreground mb-4">Preview</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
              Secondary
            </button>
            <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
              Muted
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-primary text-primary-foreground rounded-full text-sm">
              Badge
            </span>
            <span className="px-2.5 py-1 bg-success text-success-foreground rounded-full text-sm">
              Success
            </span>
            <span className="px-2.5 py-1 bg-warning text-warning-foreground rounded-full text-sm">
              Warning
            </span>
            <span className="px-2.5 py-1 bg-destructive text-destructive-foreground rounded-full text-sm">
              Danger
            </span>
          </div>
          <div className="w-full h-2 bg-primary rounded-full" />
        </div>
      </section>
    </div>
  );
}
