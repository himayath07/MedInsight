from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from services.advanced_analysis import MedicalImageAnalyzer
import base64

router = APIRouter()
analyzer = MedicalImageAnalyzer()

@router.post("/analyze/fracture")
async def analyze_fracture(file: UploadFile = File(...)):
    """
    Analyze an X-ray or CT scan for bone fractures.
    """
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/dicom", "application/dicom", "application/octet-stream"]
        if file.content_type not in allowed_types:
            return JSONResponse(
                status_code=400,
                content={"error": f"Unsupported file type: {file.content_type}. Supported types: {', '.join(allowed_types)}"}
            )
            
        # Read and validate file size (max 50MB)
        contents = await file.read()
        if len(contents) > 50 * 1024 * 1024:  # 50MB
            return JSONResponse(
                status_code=400,
                content={"error": "File too large. Maximum size is 50MB."}
            )
            
        # Process the image
        result = analyzer.analyze_image(contents, 'fracture')
        
        # Check for errors in the analysis
        if "error" in result:
            return JSONResponse(
                status_code=500,
                content={"error": f"Analysis failed: {result['error']}"}
            )
            
        return JSONResponse(content=result)
        
    except Exception as e:
        import traceback
        print(f"Error processing image: {str(e)}\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to process image: {str(e)}"}
        )

@router.post("/analyze/lung-nodule")
async def analyze_lung_nodule(file: UploadFile = File(...)):
    """
    Analyze a chest CT scan for lung nodules.
    """
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/dicom", "application/dicom", "application/octet-stream"]
        if file.content_type not in allowed_types:
            return JSONResponse(
                status_code=400,
                content={"error": f"Unsupported file type: {file.content_type}. Supported types: {', '.join(allowed_types)}"}
            )
            
        # Read and validate file size (max 50MB)
        contents = await file.read()
        if len(contents) > 50 * 1024 * 1024:  # 50MB
            return JSONResponse(
                status_code=400,
                content={"error": "File too large. Maximum size is 50MB."}
            )
            
        # Process the image
        result = analyzer.analyze_image(contents, 'lung_nodule')
        
        # Check for errors in the analysis
        if "error" in result:
            return JSONResponse(
                status_code=500,
                content={"error": f"Analysis failed: {result['error']}"}
            )
            
        return JSONResponse(content=result)
        
    except Exception as e:
        import traceback
        print(f"Error processing image: {str(e)}\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to process image: {str(e)}"}
        )

@router.post("/analyze/brain-tumor")
async def analyze_brain_tumor(file: UploadFile = File(...)):
    """
    Analyze an MRI scan for brain tumors.
    """
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/dicom", "application/dicom", "application/octet-stream"]
        if file.content_type not in allowed_types:
            return JSONResponse(
                status_code=400,
                content={"error": f"Unsupported file type: {file.content_type}. Supported types: {', '.join(allowed_types)}"}
            )
            
        # Read and validate file size (max 50MB)
        contents = await file.read()
        if len(contents) > 50 * 1024 * 1024:  # 50MB
            return JSONResponse(
                status_code=400,
                content={"error": "File too large. Maximum size is 50MB."}
            )
            
        # Process the image
        result = analyzer.analyze_image(contents, 'brain_tumor')
        
        # Check for errors in the analysis
        if "error" in result:
            return JSONResponse(
                status_code=500,
                content={"error": f"Analysis failed: {result['error']}"}
            )
            
        return JSONResponse(content=result)
        
    except Exception as e:
        import traceback
        print(f"Error processing image: {str(e)}\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to process image: {str(e)}"}
        )

@router.post("/analyze/retinal")
async def analyze_retinal(file: UploadFile = File(...)):
    """
    Analyze a retinal image for diseases.
    """
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "application/octet-stream"]
        if file.content_type not in allowed_types:
            return JSONResponse(
                status_code=400,
                content={"error": f"Unsupported file type: {file.content_type}. Supported types: {', '.join(allowed_types)}"}
            )
            
        # Read and validate file size (max 20MB for retinal images)
        contents = await file.read()
        if len(contents) > 20 * 1024 * 1024:  # 20MB
            return JSONResponse(
                status_code=400,
                content={"error": "File too large. Maximum size is 20MB for retinal images."}
            )
            
        # Process the image
        result = analyzer.analyze_image(contents, 'retinal')
        
        # Check for errors in the analysis
        if "error" in result:
            return JSONResponse(
                status_code=500,
                content={"error": f"Analysis failed: {result['error']}"}
            )
            
        return JSONResponse(content=result)
        
    except Exception as e:
        import traceback
        print(f"Error processing retinal image: {str(e)}\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to process retinal image: {str(e)}"}
        )

@router.post("/analyze/organ")
async def analyze_organ(file: UploadFile = File(...)):
    """
    Analyze an organ image for abnormalities.
    """
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/dicom", "application/dicom", "application/octet-stream"]
        if file.content_type not in allowed_types:
            return JSONResponse(
                status_code=400,
                content={"error": f"Unsupported file type: {file.content_type}. Supported types: {', '.join(allowed_types)}"}
            )
            
        # Read and validate file size (max 50MB)
        contents = await file.read()
        if len(contents) > 50 * 1024 * 1024:  # 50MB
            return JSONResponse(
                status_code=400,
                content={"error": "File too large. Maximum size is 50MB."}
            )
            
        # Process the image
        result = analyzer.analyze_image(contents, 'organ')
        
        # Check for errors in the analysis
        if "error" in result:
            return JSONResponse(
                status_code=500,
                content={"error": f"Analysis failed: {result['error']}"}
            )
            
        return JSONResponse(content=result)
        
    except Exception as e:
        import traceback
        print(f"Error processing organ image: {str(e)}\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to process organ image: {str(e)}"}
        )
