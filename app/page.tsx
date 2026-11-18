"use client";

import { useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";

export default function Home() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] =  useState("");
  const [error, setError] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  async function handleSubmit() {
      setError("");
      setShortUrl("");

      try {
          const response = await fetch("/api/shorten", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ url, alias }),
          });

          const data = await response.json();

          if (!response.ok) {
              setError(data.error);
              return;
          }

          setShortUrl(`${window.location.origin}/${data.alias}`);
      } catch {
          setError("Something went wrong. Please try again.");
      }
  }

return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper
          elevation={3}
          sx={{
            p: 4, borderRadius: 3, textAlign: "center", backgroundColor: "white", border: "2px solid #b8d8b8",
          }}
        >
        <Typography variant="h4" sx={{ mb: 2, color: "2e7d32", fontWeight: "bold" }}>
        URL Shortener
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Make your long links shorter!
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
              label="Original URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
          />

          <TextField
              label="Custom Alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              fullWidth
          />

          <Button variant="contained" size="large" onClick={handleSubmit} sx={{backgroundColor: "#4c956c", background: "#2e7d32"}}>
            Shorten URL
          </Button>
            {error && (
                <Typography color="error">
                    {error}
                </Typography>
            )}

            {shortUrl && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Here's your shortened URL!</Typography>

                    <Typography sx={{ wordBreak: "break-all" }}>
                        {shortUrl}
                    </Typography>

                    <Button
                        variant="outlined"
                        onClick={() => navigator.clipboard.writeText(shortUrl)}
                    >
                        Copy Link
                    </Button>
                </Box>
            )}
        </Box>
      </Paper>
    </Container>
  );
}