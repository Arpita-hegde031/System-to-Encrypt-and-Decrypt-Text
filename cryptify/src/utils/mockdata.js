// src/utils/mockData.js

export const BUILT_IN_USERS = [
  { email: "alice@corp.com", pw: "Alice@123", name: "Alice" },
  { email: "bob@corp.com",   pw: "Bob@1234",  name: "Bob"   },
];

export const AUDIT_LOGS = [
  { id:1, user:"alice@corp.com", op:"ENCRYPT", type:"Text",  time:"2026-03-06 09:12", status:"success" },
  { id:2, user:"bob@corp.com",   op:"DECRYPT", type:"File",  time:"2026-03-06 09:34", status:"success" },
  { id:3, user:"alice@corp.com", op:"ENCRYPT", type:"Email", time:"2026-03-06 10:01", status:"success" },
  { id:4, user:"carol@corp.com", op:"ENCRYPT", type:"File",  time:"2026-03-06 10:22", status:"fail"    },
  { id:5, user:"bob@corp.com",   op:"DECRYPT", type:"Excel", time:"2026-03-06 10:55", status:"success" },
  { id:6, user:"alice@corp.com", op:"ENCRYPT", type:"Text",  time:"2026-03-06 11:10", status:"success" },
];

export const CHART_DATA = [
  { day:"Mon", enc:42, dec:28 },
  { day:"Tue", enc:58, dec:34 },
  { day:"Wed", enc:35, dec:45 },
  { day:"Thu", enc:76, dec:52 },
  { day:"Fri", enc:63, dec:41 },
  { day:"Sat", enc:29, dec:18 },
  { day:"Sun", enc:48, dec:30 },
];

export const SYSTEM_STATUS = [
  { label:"Encryption Engine", status:"Operational", color:"#10b981", pct:99.9 },
  { label:"File Storage",       status:"Operational", color:"#10b981", pct:87.2 },
  { label:"Email Gateway",      status:"Operational", color:"#10b981", pct:94.1 },
  { label:"DB Export Service",  status:"Degraded",    color:"#fbbf24", pct:72.0 },
  { label:"Audit Logger",       status:"Operational", color:"#10b981", pct:100  },
];
