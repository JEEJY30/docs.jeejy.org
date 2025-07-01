// Advanced reading progress with time estimation
class ReadingProgress {
  constructor() {
    this.progressBar = document.querySelector('.reading-progress-bar');
    this.timeElement = document.querySelector('.reading-time-left');
    this.wordsPerMinute = 200;
    this.totalWords = this.countWords();
    this.startTime = Date.now();
    this.pauseTime = 0;
    this.isReading = true;
    
    this.init();
  }
  
  init() {
    this.updateProgress();
    this.trackReadingBehavior();
    
    window.addEventListener('scroll', throttle(() => {
      this.updateProgress();
    }, 100));
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseTime = Date.now();
        this.isReading = false;
      } else {
        if (this.pauseTime) {
          this.startTime += Date.now() - this.pauseTime;
        }
        this.isReading = true;
      }
    });
  }
  
  countWords() {
    const content = document.querySelector('.post-content');
    return content.textContent.trim().split(/\s+/).length;
  }
  
  updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;
    const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    this.progressBar.style.width = `${progress}%`;
    
    // Calculate reading time left
    const wordsLeft = Math.floor(this.totalWords * (1 - progress / 100));
    const minutesLeft = Math.ceil(wordsLeft / this.wordsPerMinute);
    
    this.timeElement.textContent = minutesLeft > 0 
      ? `${minutesLeft} min left`
      : 'Complete!';
    
    // Track milestones
    this.trackMilestone(progress);
  }
  
  trackReadingBehavior() {
    let scrollEvents = [];
    let lastScrollTime = Date.now();
    
    window.addEventListener('scroll', () => {
      const now = Date.now();
      const timeDiff = now - lastScrollTime;
      
      scrollEvents.push({
        time: now,
        position: window.pageYOffset,
        velocity: timeDiff > 0 ? Math.abs(window.pageYOffset - this.lastScrollPosition) / timeDiff : 0
      });
      
      // Keep only last 10 events
      if (scrollEvents.length > 10) {
        scrollEvents.shift();
      }
      
      // Adjust reading speed based on scroll velocity
      this.adjustReadingSpeed(scrollEvents);
      
      lastScrollTime = now;
      this.lastScrollPosition = window.pageYOffset;
    });
  }
  
  adjustReadingSpeed(events) {
    if (events.length < 5) return;
    
    const avgVelocity = events.reduce((sum, e) => sum + e.velocity, 0) / events.length;
    
    // Adjust WPM based on scroll velocity
    if (avgVelocity < 0.5) {
      this.wordsPerMinute = 150; // Slow, careful reading
    } else if (avgVelocity < 2) {
      this.wordsPerMinute = 200; // Normal reading
    } else {
      this.wordsPerMinute = 300; // Skimming
    }
  }
  
  trackMilestone(progress) {
    const milestones = [25, 50, 75, 100];
    const currentMilestone = milestones.find(m => 
      progress >= m && !this.reachedMilestones.has(m)
    );
    
    if (currentMilestone) {
      this.reachedMilestones.add(currentMilestone);
      this.sendAnalytics('reading_milestone', {
        milestone: currentMilestone,
        timeSpent: Date.now() - this.startTime,
        wordsRead: Math.floor(this.totalWords * (currentMilestone / 100))
      });
    }
  }
}

// Initialize
new ReadingProgress();