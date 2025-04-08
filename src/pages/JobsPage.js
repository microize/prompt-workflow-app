import React, { useState } from 'react';
import { Calendar, Plus, Search, X, Clock, GitBranch, Play, Pause, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const JobsPage = () => {
  // Simulated data for scheduled jobs
  const [jobs, setJobs] = useState([
    {
      id: 1,
      workflowName: "Content Marketing Pipeline",
      description: "Generate weekly blog content",
      schedule: "Every Monday at 9:00 AM",
      lastRun: "2025-04-07T09:00:00Z",
      nextRun: "2025-04-14T09:00:00Z",
      status: "active",
      category: "marketing",
      createdAt: "2025-03-10T14:30:00Z",
      logs: [
        { timestamp: "2025-04-07T09:00:12Z", message: "Job started", type: "info" },
        { timestamp: "2025-04-07T09:02:45Z", message: "Generated 3 blog post ideas", type: "info" },
        { timestamp: "2025-04-07T09:05:30Z", message: "Created outline for selected topic", type: "info" },
        { timestamp: "2025-04-07T09:15:20Z", message: "Completed article draft", type: "info" },
        { timestamp: "2025-04-07T09:15:25Z", message: "Job completed successfully", type: "success" }
      ]
    },
    {
      id: 2,
      workflowName: "Daily Code Documentation",
      description: "Generate comments for new code commits",
      schedule: "Daily at 8:00 PM",
      lastRun: "2025-04-07T20:00:00Z",
      nextRun: "2025-04-08T20:00:00Z",
      status: "active",
      category: "development",
      createdAt: "2025-03-15T11:20:00Z",
      logs: [
        { timestamp: "2025-04-07T20:00:05Z", message: "Job started", type: "info" },
        { timestamp: "2025-04-07T20:01:30Z", message: "Fetched latest commits", type: "info" },
        { timestamp: "2025-04-07T20:03:45Z", message: "Generated comments for 12 files", type: "info" },
        { timestamp: "2025-04-07T20:05:10Z", message: "Job completed successfully", type: "success" }
      ]
    },
    {
      id: 3,
      workflowName: "Customer Support Template Generator",
      description: "Create response templates based on support tickets",
      schedule: "Every Wednesday and Friday at 2:00 PM",
      lastRun: "2025-04-05T14:00:00Z",
      nextRun: "2025-04-10T14:00:00Z",
      status: "paused",
      category: "writing",
      createdAt: "2025-03-20T09:45:00Z",
      logs: [
        { timestamp: "2025-04-05T14:00:08Z", message: "Job started", type: "info" },
        { timestamp: "2025-04-05T14:02:15Z", message: "Analyzing support tickets", type: "info" },
        { timestamp: "2025-04-05T14:06:30Z", message: "Error connecting to API", type: "error" },
        { timestamp: "2025-04-05T14:06:35Z", message: "Job failed", type: "error" }
      ]
    }
  ]);
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedJobId, setExpandedJobId] = useState(null);
  
  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.workflowName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Toggle job expanded state
  const toggleExpandJob = (jobId) => {
    setExpandedJobId(prevId => prevId === jobId ? null : jobId);
  };
  
  // Toggle job status
  const toggleJobStatus = (jobId) => {
    setJobs(prevJobs => prevJobs.map(job => 
      job.id === jobId 
        ? { ...job, status: job.status === 'active' ? 'paused' : 'active' }
        : job
    ));
  };
  
  // Run job now
  const runJobNow = (jobId) => {
    alert(`Running job #${jobId} now...`);
    // Implementation would trigger the job to run immediately
  };
  
  // Delete job
  const deleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this scheduled job?')) {
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  const handleCreateNewJob = () => {
    // Navigate to workflow page with job creation mode
    const event = new CustomEvent('navigateTo', { detail: { page: 'workflow' } });
    window.dispatchEvent(event);
  };
  
  return (
    <div className="p-0 h-full bg-neutral-50">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden h-full">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Scheduled Jobs</h2>
              <p className="text-sm text-neutral-500 mt-1">Manage your automated workflow jobs</p>
            </div>
            
            <Button 
              variant="primary"
              startIcon={<Plus size={18} />}
              onClick={handleCreateNewJob}
            >
              Create Job
            </Button>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="p-6 border-b border-neutral-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="flex-shrink-0 w-full sm:w-auto">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Jobs list */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Calendar size={24} className="text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-700 mb-2">No scheduled jobs found</h3>
              <p className="text-neutral-500 max-w-md mx-auto mb-6">
                {jobs.length === 0 
                  ? "You haven't scheduled any workflow jobs yet. Create a workflow and schedule it to run automatically." 
                  : "No jobs match your current search criteria. Try adjusting your filters."}
              </p>
              
              {jobs.length === 0 ? (
                <Button 
                  variant="primary"
                  onClick={handleCreateNewJob}
                  startIcon={<Plus size={18} />}
                >
                  Create Job
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filteredJobs.map(job => (
                <div key={job.id} className="transition-colors">
                  {/* Job summary */}
                  <div 
                    className={`p-4 hover:bg-neutral-50 ${expandedJobId === job.id ? 'bg-neutral-50' : ''} cursor-pointer`} 
                    onClick={() => toggleExpandJob(job.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-neutral-800">{job.workflowName}</h3>
                        <p className="text-sm text-neutral-600">{job.description}</p>
                      </div>
                      <Badge variant={job.status === 'active' ? 'success' : 'default'}>
                        {job.status === 'active' ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Scheduled: {job.schedule}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Next run: {formatDate(job.nextRun)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <GitBranch size={14} />
                        <span>Workflow: {job.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded job details */}
                  {expandedJobId === job.id && (
                    <div className="bg-neutral-50 px-4 py-5 border-t border-neutral-100">
                      {/* Job actions */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleJobStatus(job.id);
                          }}
                          startIcon={job.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        >
                          {job.status === 'active' ? 'Pause Job' : 'Resume Job'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            runJobNow(job.id);
                          }}
                          startIcon={<RefreshCw size={16} />}
                        >
                          Run Now
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:border-red-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteJob(job.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                      
                      {/* Job details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-neutral-700 mb-2">Schedule Details</h4>
                          <div className="bg-white rounded-lg border border-neutral-200 p-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-neutral-500">Created:</div>
                              <div>{formatDate(job.createdAt)}</div>
                              
                              <div className="text-neutral-500">Last Run:</div>
                              <div>{formatDate(job.lastRun)}</div>
                              
                              <div className="text-neutral-500">Next Run:</div>
                              <div>{formatDate(job.nextRun)}</div>
                              
                              <div className="text-neutral-500">Schedule:</div>
                              <div>{job.schedule}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-neutral-700 mb-2">Recent Execution Logs</h4>
                          <div className="bg-white rounded-lg border border-neutral-200 p-2 h-32 overflow-y-auto">
                            {job.logs && job.logs.length > 0 ? (
                              <div className="space-y-2">
                                {job.logs.map((log, index) => (
                                  <div key={index} className="flex items-start gap-2 text-xs">
                                    <div className="flex-shrink-0 mt-0.5">
                                      {log.type === 'info' && <Clock size={12} className="text-neutral-400" />}
                                      {log.type === 'success' && <Check size={12} className="text-green-500" />}
                                      {log.type === 'error' && <AlertTriangle size={12} className="text-red-500" />}
                                    </div>
                                    <div className="flex-grow">
                                      <div className={`${
                                        log.type === 'error' 
                                          ? 'text-red-600' 
                                          : log.type === 'success'
                                            ? 'text-green-600'
                                            : 'text-neutral-600'
                                      }`}>
                                        {log.message}
                                      </div>
                                      <div className="text-neutral-400">
                                        {formatDate(log.timestamp)}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center text-neutral-500 text-sm p-4">
                                No logs available
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;