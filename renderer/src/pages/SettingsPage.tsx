import React, { useState } from 'react';

interface Settings {
  nodePort: number;
  miningEnabled: boolean;
  autoSync: boolean;
  theme: 'light' | 'dark';
  notifications: boolean;
}

function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    nodePort: 3001,
    miningEnabled: false,
    autoSync: true,
    theme: 'dark',
    notifications: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key: keyof Settings, value: string | number | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    // Simulate saving settings
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        nodePort: 3001,
        miningEnabled: false,
        autoSync: true,
        theme: 'dark',
        notifications: true,
      });
    }
  };

  return (
    <div className="page">
      <h1>Settings</h1>

      <div className="settings-container">
        {/* Network Settings */}
        <div className="section">
          <h2>Network Configuration</h2>
          <div className="setting-group">
            <div className="setting-item">
              <label htmlFor="nodePort">Node Port:</label>
              <input
                id="nodePort"
                type="number"
                value={settings.nodePort}
                onChange={(e) => handleSettingChange('nodePort', parseInt(e.target.value))}
                min="1024"
                max="65535"
              />
              <span className="setting-description">
                Port number for the blockchain node (default: 3001)
              </span>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.autoSync}
                  onChange={(e) => handleSettingChange('autoSync', e.target.checked)}
                />
                Auto-sync with network
              </label>
              <span className="setting-description">
                Automatically sync with other nodes in the network
              </span>
            </div>
          </div>
        </div>

        {/* Mining Settings */}
        <div className="section">
          <h2>Mining Configuration</h2>
          <div className="setting-group">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.miningEnabled}
                  onChange={(e) => handleSettingChange('miningEnabled', e.target.checked)}
                />
                Enable mining
              </label>
              <span className="setting-description">Allow this node to mine new blocks</span>
            </div>
          </div>
        </div>

        {/* UI Settings */}
        <div className="section">
          <h2>Interface Settings</h2>
          <div className="setting-group">
            <div className="setting-item">
              <label htmlFor="theme">Theme:</label>
              <select
                id="theme"
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <span className="setting-description">Choose your preferred color theme</span>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
                Enable notifications
              </label>
              <span className="setting-description">Show notifications for important events</span>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="section">
          <h2>Advanced Settings</h2>
          <div className="setting-group">
            <div className="setting-item">
              <button
                className="btn btn-secondary"
                onClick={() => alert('Database reset functionality would go here')}
              >
                Reset Database
              </button>
              <span className="setting-description">Clear all blockchain data and start fresh</span>
            </div>

            <div className="setting-item">
              <button
                className="btn btn-secondary"
                onClick={() => alert('Export functionality would go here')}
              >
                Export Configuration
              </button>
              <span className="setting-description">Export current settings to a file</span>
            </div>

            <div className="setting-item">
              <button
                className="btn btn-secondary"
                onClick={() => alert('Import functionality would go here')}
              >
                Import Configuration
              </button>
              <span className="setting-description">Import settings from a file</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="section">
          <div className="settings-actions">
            <button className="btn btn-primary" onClick={saveSettings} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
            <button className="btn btn-secondary" onClick={resetSettings}>
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
