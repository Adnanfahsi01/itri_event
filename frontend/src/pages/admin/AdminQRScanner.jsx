import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

/**
 * AdminQRScanner Component
 * Allows admin to scan QR codes from tickets and validate them
 */
function AdminQRScanner() {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Initialize QR scanner
    const scanner = new Html5QrcodeScanner('qr-reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [navigate]);

  const onScanSuccess = (decodedText) => {
    setScanResult(decodedText);
    validateQRCode(decodedText);
  };

  const onScanError = (error) => {
    // Ignore scan errors (they happen frequently while searching)
    console.debug('QR Scan error:', error);
  };

  const validateQRCode = async (qrData) => {
    setLoading(true);
    setValidationResult(null);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8000/api/reservations/validate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ qr_data: qrData }),
      });

      const data = await response.json();
      setValidationResult(data);
    } catch (error) {
      console.error('Error validating QR code:', error);
      setValidationResult({
        valid: false,
        message: 'Error connecting to server',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualValidation = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      // Create a JSON string similar to QR code data
      const qrData = JSON.stringify({ ticket_code: manualCode.trim() });
      setScanResult(qrData);
      validateQRCode(qrData);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setValidationResult(null);
    setManualCode('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">QR Code Scanner</h1>
            <Link
              to="/admin/dashboard"
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Scanner */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-accent mb-4">Scan Ticket QR Code</h2>
            
            {!scanResult ? (
              <div id="qr-reader" className="w-full"></div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">QR Code detected!</p>
                <button
                  onClick={resetScanner}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent"
                >
                  Scan Another
                </button>
              </div>
            )}

            {/* Manual Entry */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-bold text-gray-700 mb-3">Or Enter Ticket Code Manually</h3>
              <form onSubmit={handleManualValidation} className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="Enter ticket code (e.g., ABC12345)"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600"
                >
                  Validate
                </button>
              </form>
            </div>
          </div>

          {/* Validation Result */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-accent mb-4">Validation Result</h2>

            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Validating ticket...</p>
              </div>
            )}

            {!loading && !validationResult && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <p>Scan a QR code or enter a ticket code to validate</p>
              </div>
            )}

            {!loading && validationResult && (
              <div className={`p-6 rounded-lg ${
                validationResult.valid 
                  ? 'bg-green-100 border-2 border-green-500' 
                  : 'bg-red-100 border-2 border-red-500'
              }`}>
                {/* Status Icon */}
                <div className="text-center mb-4">
                  {validationResult.valid ? (
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Status Message */}
                <h3 className={`text-2xl font-bold text-center mb-4 ${
                  validationResult.valid ? 'text-green-700' : 'text-red-700'
                }`}>
                  {validationResult.valid ? 'VALID TICKET' : 'INVALID TICKET'}
                </h3>

                <p className={`text-center mb-4 ${
                  validationResult.valid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {validationResult.message}
                </p>

                {/* Reservation Details (if available) */}
                {validationResult.reservation && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <h4 className="font-bold text-gray-700 mb-2">Attendee Details:</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-semibold">Name:</span> {validationResult.reservation.first_name} {validationResult.reservation.last_name}</p>
                      <p><span className="font-semibold">Email:</span> {validationResult.reservation.email}</p>
                      <p><span className="font-semibold">Phone:</span> {validationResult.reservation.phone}</p>
                      <p><span className="font-semibold">Role:</span> {validationResult.reservation.role}</p>
                      <p><span className="font-semibold">Days:</span> {validationResult.reservation.days?.join(', ')}</p>
                      <p><span className="font-semibold">Ticket Code:</span> {validationResult.reservation.ticket_code}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-accent mb-4">Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Point the camera at the QR code on the attendee's ticket</li>
            <li>The system will automatically detect and validate the QR code</li>
            <li>Green result = Valid ticket (attendee can enter)</li>
            <li>Red result = Invalid or already used ticket</li>
            <li>Once validated, the ticket will be marked as "USED" and cannot be used again</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminQRScanner;
