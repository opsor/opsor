
```mermaid
flowchart LR
  subgraph home[Home network]
    PC["AFK window<br/>(Windows)"]
    PI["AFK on the Raspberry Pi<br/>bots · history · backups"]
    PHONE["Phone page<br/>:47124"]
  end
  MC[("Minecraft server")]
  NTFY["ntfy<br/>push service"]
  PI <-- "share link :47123<br/>share code" --> PC
  PI <-- "one connection per account" --> MC
  PHONE -- "share code" --> PI
  PI -- "alerts, reports<br/>(never coordinates)" --> NTFY
  NTFY --> PHONE
  PC -- "Update the Pi (SSH key)" --> PI
```

The bots live on the Pi. The window on your PC joins it, shows everything live and sends your clicks back, so closing the PC never stops a bot. The same AFK also runs the bots on the PC itself, without a Pi.

