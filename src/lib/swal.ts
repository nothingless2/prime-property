import Swal from 'sweetalert2'

const primaryBlack = '#1a1a1a'
const errorRed = '#B33A3A'

export const showConfirm = async (title: string, text: string) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: primaryBlack,
    cancelButtonColor: errorRed,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
    reverseButtons: true, // Puts Cancel on the left
    customClass: {
      popup: 'rounded-xl shadow-xl',
      title: 'text-xl font-bold text-gray-800',
      confirmButton: 'font-semibold rounded-md px-6 py-2',
      cancelButton: 'font-semibold rounded-md px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300'
    }
  })
  return result.isConfirmed
}

export const showSuccessToast = (title: string) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'rounded-lg shadow-lg border border-gray-100',
      title: 'text-sm font-semibold text-gray-800'
    }
  })
  Toast.fire({
    icon: 'success',
    title
  })
}

export const showErrorAlert = (text: string) => {
  Swal.fire({
    icon: 'error',
    title: 'Terjadi Kesalahan',
    text,
    confirmButtonColor: primaryBlack,
    confirmButtonText: 'Tutup',
    customClass: {
      popup: 'rounded-xl',
      title: 'text-xl font-bold text-gray-800',
      confirmButton: 'font-semibold rounded-md px-6 py-2'
    }
  })
}

export const showSuccessAlert = (title: string, text?: string) => {
  Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: primaryBlack,
    confirmButtonText: 'OK',
    customClass: {
      popup: 'rounded-xl',
      title: 'text-xl font-bold text-gray-800',
      confirmButton: 'font-semibold rounded-md px-6 py-2'
    }
  })
}

export const showPrompt = async (title: string, inputPlaceholder: string = '') => {
  const result = await Swal.fire({
    title,
    input: 'password',
    inputLabel: 'PASSWORD BARU',
    inputPlaceholder,
    showCancelButton: true,
    confirmButtonText: 'Simpan Password',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    buttonsStyling: false,
    width: '28rem',
    customClass: {
      popup: 'rounded-xl shadow-lg border border-gray-100 !p-8',
      title: '!text-2xl !font-bold !text-[#1a1a1a] !text-left !p-0 !m-0 !mb-6',
      inputLabel: '!text-xs !font-bold !text-gray-500 !uppercase !tracking-wider !text-left !block !mb-2 !justify-start !w-full',
      input: '!w-full !m-0 !bg-white !border !border-gray-200 !rounded-md !px-4 !py-3 !text-sm focus:!outline-none focus:!border-[#D4AF37] focus:!ring-1 focus:!ring-[#D4AF37] !transition-colors !shadow-none',
      actions: '!flex !gap-4 !w-full !mt-8 !p-0',
      confirmButton: '!flex-1 !bg-[#1a1a1a] !text-white !rounded-md !py-3 !font-semibold !text-sm hover:!bg-gray-800 !transition-colors',
      cancelButton: '!flex-1 !bg-white !border !border-gray-200 !text-gray-700 !rounded-md !py-3 !font-semibold !text-sm hover:!bg-gray-50 !transition-colors'
    },
    inputValidator: (value) => {
      if (!value) {
        return 'Password tidak boleh kosong!'
      }
      if (value.length < 6) {
        return 'Password minimal 6 karakter!'
      }
    }
  })
  
  if (result.isConfirmed) {
    return result.value
  }
  return null
}
