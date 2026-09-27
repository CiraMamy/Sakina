# AI Architecture

## Overview

The AI layer is not the entire platform; it is a set of specialized subsystems under a model gateway and safety policy layer.

## Components

### 1. Model Gateway

Abstracts provider logic so the backend can switch between cloud providers or local inference without breaking the application.

### 2. Affect Core

Builds a multi-dimensional affect state from user input and context, with uncertainty and confidence.

### 3. Safety Core

Screens for crisis, self-harm, abuse, and extreme distress before any final response is generated.

### 4. Knowledge Engine

Retrieves medical and mental health content from trusted sources using source-aware retrieval.

### 5. Response Policy Engine

Decides the appropriate response mode based on risk and context.

### 6. Memory Engine

Manages short-term and consented long-term memory separately.

## Important rule

AI should produce probability-based emotional estimates, not certainty-based clinical diagnosis.

