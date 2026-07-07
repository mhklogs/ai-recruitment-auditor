import { CandidateScenario } from "./types";

export const SCENARIOS: CandidateScenario[] = [
  {
    id: "scen-alex-rivera",
    name: "Alex Rivera",
    candidateEmail: "alex.rivera@example.com",
    role: "Senior Backend Engineer",
    seniority: "Senior (L5/L6 equivalent)",
    difficulty: "Hard",
    expectedResult: "Failed Integrity Audit",
    resume: `ALEX RIVERA\nEmail: alex.rivera@example.com\nPhone: +1-555-0199\nLocation: San Francisco, CA\n\nPROFESSIONAL SUMMARY\nHighly accomplished Senior Backend Engineer with 9 years of experience designing and optimizing high-throughput distributed systems. Specialized in Python concurrency, custom thread-safe lock mechanisms, and high-performance caching layers.\n\nEXPERIENCE\nLead Distributed Systems Engineer | CloudScale Inc. (2022 - Present)\n- Designed and built a custom sliding window rate limiting engine handling 450,000 requests/sec with O(1) latency.\n- Refactored core multiprocessing cache daemon, saving $40,000/month in cloud infrastructure costs.\n- Guided architectural design authorities for a team of 12 software developers.\n\nSenior Backend Developer | CoreByte Systems (2018 - 2022)\n- Re-architected data ingestion pipeline from Python Asyncio to microservice modules.\n- Managed integration of Redis pub-sub messaging queues for real-time synchronization.\n\nEDUCATION\nBS in Computer Science | Stanford University (Graduated 2017)`,
    jobContext: {
      roleRequirements: "Design and implement high-throughput thread-safe distributed utilities. Focus on low latency, concurrent data structures, and defensive system design.",
      seniorityLevel: "Senior Software Engineer (8+ years experience, autonomous design authority)",
      coreTechStack: "Python 3.11, Asyncio, Multiprocessing, Redis, Memory Caching"
    },
    examData: {
      questionPrompt: "Design an in-memory, thread-safe Sliding Window Rate Limiter in Python without external libraries. Ensure it is thread-safe and optimized for near O(1) lookups.",
      candidateAnswer: `import time
from threading import Lock
from collections import deque

class SlidingWindowRateLimiter:
    """
    An ultra-high performance, thread-safe sliding window rate limiter.
    Optimized for O(1) operations using double-ended queues and atomic locks.
    """
    def __init__(self, capacity: int, window_size_seconds: float):
        if capacity <= 0:
            raise ValueError("Capacity must be greater than zero.")
        if window_size_seconds <= 0:
            raise ValueError("Window size must be greater than zero.")
            
        self.capacity = capacity
        self.window_size = window_size_seconds
        self.lock = Lock()
        self.buckets = {}

    def allow_request(self, client_id: str) -> bool:
        current_time = time.time()
        boundary = current_time - self.window_size
        
        with self.lock:
            # Atomic lookups and slide the window for the specific client
            if client_id not in self.buckets:
                self.buckets[client_id] = deque()
                
            timestamps = self.buckets[client_id]
            
            # Prune obsolete elements from the left of the double-ended queue
            while timestamps and timestamps[0] <= boundary:
                timestamps.popleft()
                
            if len(timestamps) < self.capacity:
                timestamps.append(current_time)
                return True
                
            return False`,
      typingDurationMin: 3.5,
      incrementalAttempts: [
        "Started test. Opened editor workspace.",
        "Candidate copied the entire question prompt.",
        "System idle for 2 minutes and 40 seconds.",
        "Candidate pasted a perfectly structured, 35-line Python implementation with type-hints and docstrings in a single block (elapsed: 1.2 seconds)."
      ]
    },
    behavioralTelemetry: {
      tabSwitchesCount: 1,
      bulkPastesCount: 1,
      averageTypingSpeedWpm: 450, // Humanly impossible
      events: [
        {
          timestamp: "00:00:10",
          event_type: "idle",
          details: "Reading prompt. Gaze tracking shows focused reading.",
          duration_sec: 15
        },
        {
          timestamp: "00:00:25",
          event_type: "tab_switch",
          details: "Candidate switched focus from the test environment to an external browser window.",
          duration_sec: 162
        },
        {
          timestamp: "00:03:07",
          event_type: "paste",
          details: "Pasted a block of 35 lines (854 characters) into the code editor instantaneously (150ms transfer time). Source: Clipboard.",
        },
        {
          timestamp: "00:03:20",
          event_type: "compile",
          details: "Successful run. All 12/12 rate-limiting unit tests passed with 0ms compiler warnings."
        }
      ]
    }
  },
  {
    id: "scen-sophia-chen",
    name: "Sophia Chen",
    candidateEmail: "sophia.chen@example.com",
    role: "Frontend Engineer",
    seniority: "Mid-Level",
    difficulty: "Medium",
    expectedResult: "Review Recommended",
    resume: `SOPHIA CHEN\nEmail: sophia.chen@example.com\nLocation: New York, NY\n\nPROFESSIONAL SUMMARY\nMid-Level React Developer with 4 years of experience building beautiful, responsive web applications. Specialized in TypeScript, state management, and optimizing component render times.\n\nEXPERIENCE\nFrontend Developer | WebDev Agency (2022 - Present)\n- Developed complex custom hooks (useDebounceValue, useIntersectionObserver) to minimize unnecessary re-renders.\n- Migrated legacy state management systems to React Context and custom reducers.\n- Styled components using Tailwind CSS for full accessibility compliance.\n\nJunior Frontend Developer | Pixels Group (2020 - 2022)\n- Built interactive dashboard pages for e-commerce platforms.\n- Collaborated with UX designers to build pixel-perfect UI.\n\nEDUCATION\nBA in Digital Media | NYU (Graduated 2020)`,
    jobContext: {
      roleRequirements: "Develop responsive, highly interactive web applications using React. Expertise in custom hooks, optimization, performance debouncing, and event listeners.",
      seniorityLevel: "Mid-Level React Developer (3-5 years experience)",
      coreTechStack: "React 18+, TypeScript, Tailwind CSS, Custom Hooks"
    },
    examData: {
      questionPrompt: "Implement a custom React hook 'useDebounceValue' in TypeScript. It must debounce a generic value and optionally trigger an onDebounceComplete callback.",
      candidateAnswer: `import { useState, useEffect } from 'react';

export function useDebounceValue<T>(
  value: T, 
  delay: number = 500, 
  onComplete?: (val: T) => void
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Standard timer setup
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      if (onComplete) {
        onComplete(value);
      }
    }, delay);

    // Critical cleanup to avoid memory leaks
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Triggers when inputs change

  return debouncedValue;
}`,
      typingDurationMin: 18,
      incrementalAttempts: [
        "Wrote initial custom hook shell with generic T.",
        "Added useEffect with standard setTimeout.",
        "Forgotten dependencies in useEffect. App crashed due to infinite re-render loop.",
        "Fixed dependency array by adding [value, delay]. Added standard cleanup return statement.",
        "Modified file to include optional onComplete callback support."
      ]
    },
    behavioralTelemetry: {
      tabSwitchesCount: 4,
      bulkPastesCount: 1,
      averageTypingSpeedWpm: 48,
      events: [
        {
          timestamp: "00:01:10",
          event_type: "keystroke_burst",
          details: "Typing initial imports and hook definition.",
          duration_sec: 120
        },
        {
          timestamp: "00:03:30",
          event_type: "tab_switch",
          details: "Switched tab to developer documentation (MDN Web Docs or standard React docs).",
          duration_sec: 14
        },
        {
          timestamp: "00:03:44",
          event_type: "keystroke_burst",
          details: "Resumed active code editing, building the useEffect hook.",
          duration_sec: 240
        },
        {
          timestamp: "00:08:15",
          event_type: "compile",
          details: "Compiler error: 'useDebounceValue' triggers infinite render loop (no cleanup/missing deps)."
        },
        {
          timestamp: "00:09:40",
          event_type: "tab_switch",
          details: "Brief exit to research React cleanup function syntax.",
          duration_sec: 32
        },
        {
          timestamp: "00:10:25",
          event_type: "paste",
          details: "Pasted a standard 4-line React timeout cleanup block from external docs.",
        },
        {
          timestamp: "00:11:00",
          event_type: "compile",
          details: "All tests passed successfully."
        }
      ]
    }
  },
  {
    id: "scen-marcus-vance",
    name: "Marcus Vance",
    candidateEmail: "marcus.vance@example.com",
    role: "Staff DevOps Engineer",
    seniority: "Staff / Principal",
    difficulty: "Hard",
    expectedResult: "Clear",
    resume: `MARCUS VANCE\nEmail: marcus.vance@example.com\nLocation: Seattle, WA\n\nPROFESSIONAL SUMMARY\nStaff DevOps Engineer with 12 years of enterprise cloud experience. Expert in Kubernetes Operator design, Core Go controller loops, Optimistic Concurrency Control, and API Server extensions.\n\nEXPERIENCE\nPrincipal Infrastructure Architect | KubeSphere Global (2021 - Present)\n- Designed and authored custom Kubernetes controllers in Go using controller-runtime.\n- Implemented rate-limited requeuing systems to resolve etcd transaction lock contention.\n- Managed migrations of 2,000 microservice clusters to cloud-native platforms.\n\nSenior SRE | CloudCore Platforms (2016 - 2021)\n- Managed automation of continuous deployment pipelines.
- Reduced multi-region deployment drift by 45% using native client-go configurations.\n\nEDUCATION\nMS in Software Engineering | University of Washington (Graduated 2014)`,
    jobContext: {
      roleRequirements: "Architect kubernetes operator controllers, deep understanding of state reconciliation loops, native controller performance, and Kubernetes Client Go libraries.",
      seniorityLevel: "Staff / Principal Cloud Infrastructure Engineer",
      coreTechStack: "Go, Kubernetes Operators, Client-Go, Controller-Runtime"
    },
    examData: {
      questionPrompt: "Design a production-ready Kubernetes controller reconciliation loop structure in Go. Detail how you prevent lock contention and address transient sync failures.",
      candidateAnswer: `package controller

import (
	"context"
	"fmt"
	"time"

	"github.com/go-logr/logr"
	"k8s.io/apimachinery/pkg/api/errors"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

type CustomResourceReconciler struct {
	client.Client
	Log logr.Logger
}

// Reconcile coordinates cluster actual state with custom declared specifications.
// Crucial: We use rate-limited requeuing on transient conflicts rather than infinite panics.
func (r *CustomResourceReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	log := r.Log.WithValues("customresource", req.NamespacedName)
	log.Info("Starting reconciliation event loop")

	// 1. Fetch current status from API Server
	var resource CustomResource
	if err := r.Get(ctx, req.NamespacedName, &resource); err != nil {
		if errors.IsNotFound(err) {
			// Object has been deleted under our feet. No-op since finalizers handle teardowns.
			log.Info("Target CustomResource deleted. Skipping reconciliation.")
			return ctrl.Result{}, nil
		}
		// Connection issues, retry with exponential backoff
		log.Error(err, "Failed to retrieve resource state due to cluster network glitch.")
		return ctrl.Result{RequeueAfter: 5 * time.Second}, err
	}

	// 2. Perform deep reconciliation work
	// We prevent resource contention by avoiding global mutex locks; relying instead 
	// on Optimistic Concurrency Control (OCC) natively built inside etcd.
	if err := r.syncClusterStatus(ctx, &resource); err != nil {
		if errors.IsConflict(err) {
			// Version conflict in etcd. Immediate retry is optimal.
			log.Info("OCC version collision. Requeuing immediately.")
			return ctrl.Result{Requeue: true}, nil
		}
		return ctrl.Result{}, fmt.Errorf("sync failure: %w", err)
	}

	// 3. Sync finished. Requeue to review health again in 1 hour
	return ctrl.Result{RequeueAfter: 1 * time.Hour}, nil
}

func (r *CustomResourceReconciler) syncClusterStatus(ctx context.Context, res *CustomResource) error {
	// Simulated deep infrastructure cluster binding
	return nil
}`,
      typingDurationMin: 32,
      incrementalAttempts: [
        "Set up package declaration and client-go imports.",
        "Drafted basic Reconcile skeleton.",
        "Added standard kubernetes NotFound error handling.",
        "Refined etcd Optimistic Concurrency Control handling to handle etcd resource version conflicts without crashing the scheduler.",
        "Documented architecture decisions inside the code comments."
      ]
    },
    behavioralTelemetry: {
      tabSwitchesCount: 0,
      bulkPastesCount: 0,
      averageTypingSpeedWpm: 55,
      events: [
        {
          timestamp: "00:01:00",
          event_type: "keystroke_burst",
          details: "Drafting imports and base reconciler struct definition.",
          duration_sec: 240
        },
        {
          timestamp: "00:06:30",
          event_type: "idle",
          details: "Pauses. Gaze tracking shows gaze remaining on the code lines, likely organizing Go error checking branches.",
          duration_sec: 45
        },
        {
          timestamp: "00:07:15",
          event_type: "keystroke_burst",
          details: "Implementing main reconciliation loop body and etcd error handling.",
          duration_sec: 380
        },
        {
          timestamp: "00:15:20",
          event_type: "compile",
          details: "Go build failed: unresolved import 'k8s.io/apimachinery/pkg/api/errors' syntax typo."
        },
        {
          timestamp: "00:16:05",
          event_type: "keystroke_burst",
          details: "Fixing import typo and writing detailed architectural comments explaining why etcd OCC model avoids mutexes.",
          duration_sec: 180
        },
        {
          timestamp: "00:22:00",
          event_type: "compile",
          details: "Build succeeded. Lint checks: 0 warnings, 0 cognitive complexity complaints."
        }
      ]
    }
  }
];
