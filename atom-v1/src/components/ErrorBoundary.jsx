import React from 'react';

// ErrorBoundary.jsx: Komponen untuk menangkap error pada child components dan menampilkan fallback UI yang informatif.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Inisialisasi state untuk melacak apakah terjadi error dan menyimpan informasinya
    this.state = { hasError: false, error: null, errorInfo: null };
    console.log('ErrorBoundary: Constructor dipanggil.');
  }

  // Method statis untuk memperbarui state saat ada error
  static getDerivedStateFromError(error) {
    // Memperbarui state agar render berikutnya menampilkan fallback UI
    console.log('ErrorBoundary: getDerivedStateFromError dipanggil.', { error });
    return { hasError: true, error: error };
  }

  // Method untuk mencatat informasi error
  componentDidCatch(error, errorInfo) {
    // Mencatat error ke layanan pencatatan error (misalnya: console.log, Sentry, dll.)
    console.error('ErrorBoundary: componentDidCatch dipanggil.', error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    // Jika terjadi error, tampilkan fallback UI
    if (this.state.hasError) {
      console.log('ErrorBoundary: Merender fallback UI.');
      return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500">Terjadi Kesalahan</h2>
          <p className="mt-2 text-gray-400">
            Maaf, ada yang tidak beres. Berikut detailnya:
          </p>
          <details className="mt-4 w-full max-w-lg rounded-lg bg-gray-900 p-4 text-left text-gray-500">
            <summary className="cursor-pointer font-semibold text-red-400">
              {this.state.error && this.state.error.toString()}
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words text-sm">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
        </div>
      );
    }
    
    // Jika tidak ada error, render child components seperti biasa
    console.log('ErrorBoundary: Merender children.');
    return this.props.children;
  }
}

export default ErrorBoundary;
